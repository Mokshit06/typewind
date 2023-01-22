import { createTypewindContext } from './utils';
const ctx = createTypewindContext();
const { candidateRuleMap, variantMap } = ctx;
const variants = [...variantMap.keys()];

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

const fmt = (s: string) => s.replace(/_/g, '-');

export const createTW: any = () => {
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
        const name = fmt(p);

        if (variants.includes(name)) {
          return (arg: any) => {
            for (const a of arg.toString().split(' ')) {
              target.classes.add(`${name}:${a}`);
            }
            return thisTw;
          };
        }
        if (target.prevProp?.endsWith('-')) {
          target.classes.add(
            fmtArbitraryRule(target.prevProp.slice(0, -1), p, candidateRuleMap)
          );
          // dont add a class if name ends with - because then value is in next prop
        } else if (!name.endsWith('-')) {
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
