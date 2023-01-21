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

const typeTemplate = (
  name: string,
  props: [prop: string, type: string, doc: string][]
) => `
type ${name} = {
  ${props
    .map(([prop, type, doc]) => `/** ${createDoc(doc)} */ ${prop}: ${type};`)
    .join('\n')}
}
`;

const rootTypeTemplate = (others: string[], types: string[]) =>
  `type Property = Headwind & string;

${others.join('\n')}

type Headwind = ${types.join(' & ')}

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

function removeLastHyphen(str: string) {
  const arr = str.split('-');
  return arr.slice(0, arr.length - 1).join('-');
}

export async function generateTypes() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(require(configFile!));

  const ctx = createContext(userConfig);
  const classList = (ctx.getClassList() as string[]).filter(
    s => !s.startsWith('-')
  );
  const classNames = [
    ...new Set(
      classList
        .filter(s => s.includes('-'))
        .map(s => {
          removeLastHyphen(s).replace(/-/g, '_');
        })
    ),
  ];

  const classesWithSpecialSyntax = classList.filter(s => /\.|\//.test(s));
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
              const selector = Object.keys(ruleSet)[0];
              css += `${selector} ${fmtRuleset(ruleSet[selector])}` + '\n';
            }
          }
          if (typeof ruleOrFn == 'object') {
            css += fmtNode(ruleOrFn) + '\n';
          }
        }
      }

      return [s.replace(/-/g, '_'), 'Property', css];
    })
  );
  const arbitrary = typeTemplate(
    'Arbitrary',
    classNames.map(s => [`${s}_`, 'Record<string, Property>', ''])
  );

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
