#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { transform } from 'lightningcss';
import { createTypewindContext, loadConfig } from './utils';

function createDoc(doc: string) {
  try {
    let cssDoc = `
    * \`\`\`css
    * ${transform({
      filename: 'doc.css',
      code: Buffer.from(doc),
    })
      .code.toString()
      .replace(/\n/g, '\n    * ')}
    * \`\`\`
  `;
    const config = loadConfig();
    if (config.showPixelEquivalents) {
      const remMatch = doc.match(/-?[0-9.]+rem/g);
      const pxValue = config.rootFontSize;
      if (remMatch) {
        cssDoc = cssDoc.replace(
          /(-?[0-9.]+)rem/g,
          // There is a zero-width space between * and / in the closing comment
          // without which typescript closes the tsdoc comment
          (match, p1) => `${match} /* ${parseFloat(p1) * pxValue}px *​/`
        );
      }
    }
    return cssDoc;
  } catch (error) {
    return doc;
  }
}

const fmtToTypewind = (s: string) => s.replace(/-/g, '_').replace(/^\@/, '$');

const objectTemplate = (
  props: { prop: string; type: string; doc?: string }[]
) => {
  return `{${props
    .map(
      ({ prop, type, doc }) =>
        `/** ${doc ? createDoc(doc) : ''} */ ${JSON.stringify(prop)}: ${type};`
    )
    .join('\n')}}`;
};

const typeTemplate = (
  name: string,
  props: { prop: string; type: string; doc?: string }[]
) => `
type ${name} = ${objectTemplate(props)}
`;

const rootTypeTemplate = ({
  others,
  types,
  modifiers,
  colors,
}: {
  others: string[];
  types: string[];
  modifiers: string[];
  colors: string[];
}) =>
  `type Property = Typewind & string;

${others.join('\n')}

type OpacityMap = {
  [K in Opacity]: Property;
} & Record<string, Property>;
type Colors = {
  ${colors.map((color) => `${color}: OpacityMap`).join(';\n')}
}

type Typewind = ${types.join(' & ')} & {
  ${modifiers
    .map((variant) => `${variant}(style: Property): Property`)
    .join(';\n')}
} & {
  // [arbitraryVariant: string]: (style: Property) => Property;
} & {
  variant<T extends \`&\${string}\` | \`@\${string}\`>(variant: T, style: Property | string): Property;
  raw(style: string): Property;
}

declare const tw: Typewind;

export { tw };
`;

function getCandidateItem(
  map: Map<string, any>,
  name: string,
  rest: string | undefined = undefined
): { rule: any; rest: string | undefined } {
  let rule = map.get(name);

  if (!rule && name.includes('-')) {
    const arr = name.split('-');
    const key = arr.slice(0, arr.length - 1).join('-');
    return getCandidateItem(
      map,
      key,
      [arr[arr.length - 1], rest].filter(Boolean).join('-')
    );
  }

  return { rule, rest };
}

export async function generateTypes() {
  const ctx = createTypewindContext();

  // only exists to generate rule-map for swc plugin
  // const candidateRuleMap = ctx.candidateRuleMap;

  // const candidateObj = Object.fromEntries(
  //   [...candidateRuleMap.entries()]
  //     .map(([k, rules]) => {
  //       return [
  //         k,
  //         rules
  //           .filter(
  //             ([rule]: any) => rule.options?.values
  //             // rule.options?.values.every1((v: any) => typeof v === 'string')
  //           )
  //           .map(([rule]: any) => Object.keys(rule.options?.values)),
  //       ];
  //     })
  //     .filter(([k, v]) => v.length > 0)
  // );

  // fs.writeFileSync('./map.json', JSON.stringify(candidateObj));

  const classList = ctx.getClassList() as string[];

  const opacityMap = ctx.tailwindConfig.theme.opacity;
  const flatColorsList: string[] = [];

  for (const [k, v] of Object.entries(ctx.tailwindConfig.theme.colors)) {
    if (typeof v === 'object') {
      for (const col in v) {
        flatColorsList.push(k + '-' + col);
      }
    } else {
      flatColorsList.push(k);
    }
  }

  const classesWithStandardSyntax = classList.filter((s) => !/\.|\//.test(s));
  const classesWithCandidateItem = classesWithStandardSyntax.map((s) => {
    return [s, getCandidateItem(ctx.candidateRuleMap, s)] as const;
  });

  const colorSet = new Set<string>();
  const standard = typeTemplate(
    'Standard',
    classesWithCandidateItem.map(([s, { rule: rules, rest }]) => {
      let css = '';

      if (rules) {
        for (const rule of rules) {
          const [info, ruleOrFn] = rule;

          if (typeof ruleOrFn === 'function') {
            const types = info.options.types;
            const isColor = types.some(
              (t: Record<string, string>) => t.type == 'color'
            );

            if (isColor && rest && flatColorsList.includes(rest)) {
              const key = fmtToTypewind(s) + '$';

              colorSet.add(key);
            }

            const [ruleSet] = ruleOrFn(rest ?? 'DEFAULT', {});
            if (ruleSet) {
              css += fmtRuleToCss(ruleSet);
            }
          }
          if (typeof ruleOrFn == 'object') {
            css += fmtNode(ruleOrFn) + '\n';
          }
        }
      }

      return { prop: fmtToTypewind(s), type: 'Property', doc: css };
    })
  );
  const candidates = [...ctx.candidateRuleMap.entries()];
  const arbitraryStyles = [];
  for (const [name, rules] of candidates) {
    const ident = fmtToTypewind(name) + '_';
    const styles: string[] = [];

    for (const [rule, fn] of rules) {
      if (
        !rule.options ||
        !rule.options.values ||
        Object.keys(rule.options.values).length == 0
      )
        continue;

      styles.push(
        objectTemplate(
          Object.keys(rule.options.values).map((val) => {
            const [ruleSet] = fn(val, {});

            return {
              prop: val,
              type: 'Property',
              doc: fmtRuleToCss(ruleSet),
            };
          })
        )
      );
    }

    arbitraryStyles.push({
      prop: ident,
      type: styles.join(' & ') + ' & Record<string, Property>',
      doc: undefined,
    });
  }

  const arbitrary = typeTemplate('Arbitrary', arbitraryStyles);

  const modifiers = [...ctx.variantMap.keys(), 'important']
  // Remove * from the list of modifiers to avoid syntax error
  .filter((s) => s !== '*')
  .map((s) => {
    s = /^\d/.test(s) ? `_${s}` : s;

    return fmtToTypewind(s);
  });

  const root = rootTypeTemplate({
    others: [
      standard,
      arbitrary,
      `type Opacity = ${Object.keys(opacityMap)
        .map((k) => JSON.stringify(k))
        .join(' | ')}`,
    ],
    types: ['Standard', 'Arbitrary', 'Colors'],
    modifiers,
    colors: [...colorSet].map((k) => JSON.stringify(k)),
  });

  fs.writeFileSync(
    path.join(require.resolve('typewind'), '../index.d.ts'),
    root,
    'utf8'
  );
}

function fmtRuleset(rule: any) {
  return (
    '{' +
    Object.entries(rule)
      .map(([prop, value]): any => {
        if (!value) return '';
        if (typeof value === 'object') return `${prop} ${fmtRuleset(value)}`;

        return `${prop}: ${value}`;
      })
      .join(';') +
    '}'
  );
}

function fmtNode(node: any) {
  if (node.type === 'atrule') {
    return `\\@${node.name} ${node.params} {${node.nodes
      .map(fmtNode)
      .join('')}}`;
  }
  if (node.type === 'decl') {
    return `${node.prop}: ${node.value};`;
  }
  if (node.type === 'rule') {
    return `${node.selector} {${node.nodes.map(fmtNode).join('')}}`;
  }
}

function fmtRuleToCss(ruleSet: any) {
  const selector = Object.keys(ruleSet)[0];
  return `${selector} ${fmtRuleset(ruleSet[selector])}`;
}

generateTypes().catch((err) => {
  console.error(err);
  process.exit(1);
});
