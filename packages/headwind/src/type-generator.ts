import fs from 'fs';
import path, { resolve } from 'path';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import { createContext } from 'tailwindcss/src/lib/setupContextUtils.js';
import prettier from 'prettier';

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
  `type Property = Headwind & string;

${others.join('\n')}

type Headwind = ${types.join(' & ')};

declare const tw: Headwind;

export { tw };
`;

function getConfigPath() {
  for (const configFile of ['./tailwind.config.js', './tailwind.config.cjs']) {
    try {
      const configPath = path.join(process.cwd(), configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }

  throw new Error('No tailwind config file found');
}

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
  const configFile = getConfigPath();
  const userConfig = resolveConfig(require(configFile!));

  const ctx = createContext(userConfig);
  const classList = (ctx.getClassList() as string[]).filter(
    s => !s.startsWith('-')
  );

  // const classesWithSpecialSyntax = classList.filter(s => /\.|\//.test(s));
  const classesWithStandardSyntax = classList.filter(s => !/\.|\//.test(s));
  const standard = typeTemplate(
    'Standard',
    classesWithStandardSyntax.map(s => {
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
          Object.keys(rule.options.values).map(val => {
            const [ruleSet] = fn(val, {});

            return [JSON.stringify(val), 'Property', fmtRuleToCss(ruleSet)];
          })
        ) + ' & Record<string, Property>',
        undefined,
      ]);
    }
  }

  const arbitrary = typeTemplate('Arbitrary', arbitraryStyles);
  // console.dir(ctx.candidateRuleMap.get('mt'), { depth: 6 });

  const root = rootTypeTemplate(
    [standard, arbitrary],
    ['Standard', 'Arbitrary']
  );

  fs.writeFileSync(
    path.join(require.resolve('headwind'), '../index.d.ts'),
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
