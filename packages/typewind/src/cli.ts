#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { createTypewindContext } from './utils';

function createDoc(doc: string) {
  return `
    * \`\`\`css
    * ${prettier
      .format(doc, { parser: 'css', tabWidth: 4 })
      .replace(/\n/g, '\n    *')}
    * \`\`\`
  `;
}

const fmtHyphen = (s: string) => s.replace(/-/g, '_');

const objectTemplate = (
  props: [prop: string, type: string, doc?: string][]
) => {
  return `{${props
    .map(
      ([prop, type, doc]) =>
        `/** ${doc ? createDoc(doc) : ''} */ ${prop}: ${type};`
    )
    .join('\n')}}`;
};

const typeTemplate = (
  name: string,
  props: [prop: string, type: string, doc?: string][]
) => `
type ${name} = ${objectTemplate(props)}
`;

const rootTypeTemplate = (
  others: string[],
  types: string[],
  modifiers: string[] = []
) =>
  `type Property = Typewind & string;

${others.join('\n')}

type Typewind = ${types.join(' & ')} & {
  ${modifiers
    .map((variant) => `${variant}(style: Property): Property`)
    .join(';')}
};

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
  const classList = (ctx.getClassList() as string[]).filter(
    (s) => !s.startsWith('-')
  );

  const classesWithStandardSyntax = classList.filter((s) => !/\.|\//.test(s));
  const standard = typeTemplate(
    'Standard',
    classesWithStandardSyntax.map((s) => {
      let { rule: rules, rest } = getCandidateItem(ctx.candidateRuleMap, s);
      let css = '';

      if (rules) {
        for (const rule of rules) {
          const [_info, ruleOrFn] = rule;

          if (typeof ruleOrFn === 'function') {
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

      return [fmtHyphen(s), 'Property', css];
    })
  );
  const candidates = [...ctx.candidateRuleMap.entries()];
  const arbitraryStyles: [string, string, string?][] = [];
  for (const [name, rules] of candidates) {
    for (const [rule, fn] of rules) {
      if (!rule.options || !rule.options.values) continue;
      const ident = fmtHyphen(name) + '_';

      arbitraryStyles.push([
        ident,
        objectTemplate(
          Object.keys(rule.options.values).map((val) => {
            const [ruleSet] = fn(val, {});

            return [JSON.stringify(val), 'Property', fmtRuleToCss(ruleSet)];
          })
        ) + ' & Record<string, Property>',
        undefined,
      ]);
    }
  }

  const arbitrary = typeTemplate('Arbitrary', arbitraryStyles);

  const root = rootTypeTemplate(
    [standard, arbitrary],
    ['Standard', 'Arbitrary'],
    [...ctx.variantMap.keys()].map((s) => {
      s = /^\d/.test(s) ? `_${s}` : s;

      return fmtHyphen(s);
    })
  );

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
        if (!value) return prop;
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
