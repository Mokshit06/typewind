import { createTypewindContext } from './utils';
const ctx = createTypewindContext();
const { candidateRuleMap, variantMap, getClassList } = ctx;
const variants = [...variantMap.keys()];
const classList = getClassList();

function fmtArbitraryRule(name: string, value: string, candidateRuleMap: any) {
  const classes = [];
  const rules = candidateRuleMap.get(name);

  if (rules) {
    const isKnownValue = rules.some(
      ([rule]: any) => value in rule.options.values
    );

    classes.push(`${name}-${isKnownValue ? value : `[${value}]`}`);
  }

  return classes.join(' ');
}

const fmtToTailwind = (s: string) =>
  s.replace(/_/g, '-').replace(/^\$/, '@').replace(/\$/, '/');

export const createTw: any = () => {
  const twUsed = (classes = new Set<string>()) => {
    const target = {
      classes,
      // prevProp is for keeping track of dynamic values
      // if previous acces ends with _ then its dynamic
      prevProp: undefined as string | undefined,
      // proxy can't be used as string so convert it
      toString() {
        return [...target.classes].join(' ');
      },
    };

    const thisTw: any = new Proxy(target, {
      get(target, p, recv) {
        // @ts-ignore
        // just returns the above toString method
        if (p === 'toString') return Reflect.get(...arguments);

        // remove symbols
        if (typeof p !== 'string') return null;

        // changes _ to -
        const name = fmtToTailwind(p);

        if (target.prevProp?.endsWith('-')) {
          target.classes.add(
            fmtArbitraryRule(target.prevProp.slice(0, -1), p, candidateRuleMap)
          );
        } else if (target.prevProp?.endsWith('/')) {
          target.classes.add(`${target.prevProp}${name}`);
        } else if (!name.endsWith('-') && !name.endsWith('/')) {
          if (!classList.includes(name)) {
            const prefix =
              name === 'important'
                ? '!'
                : variants.includes(name)
                ? `${name}:`
                : `[${name}]:`;

            function spreadModifier(prefix: string, chunks: any) {
              for (const chunk of chunks.toString().split(' ')) {
                target.classes.add(`${prefix}${chunk}`);
              }

              return thisTw;
            }

            if (name === 'variant') {
              return (modifier: any, classes: any) =>
                spreadModifier(`${modifier}:`, classes);
            }

            return (arg: any) => spreadModifier(prefix, arg);
          }
          target.classes.add(name);
        }

        target.prevProp = name as string;

        return thisTw;
      },
    });

    return thisTw;
  };

  const tw = new Proxy(
    {},
    {
      get(target, p, recv) {
        // @ts-ignore
        if (typeof p !== 'string') return Reflect.get(...arguments);

        return twUsed()[p];
      },
    }
  );

  return tw;
};
