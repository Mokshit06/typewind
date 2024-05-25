const fmtToTailwind = (s: string) =>
  s.replace(/_/g, '-').replace(/^\$/, '@').replace(/\$/, '/');

type ToStringable = { toString(): string };

export const typewind_id = Symbol.for('typewind_style');

export function createRuntimeTw() {
  const twUsed = (classes = new Set<string>()) => {
    // needs to be a function so it's callable
    const target = Object.assign(() => {}, {
      classes,
      prevProp: undefined as string | undefined,
      maybeVariant: undefined as string | undefined,
      // proxy can't be used as string so convert it
      [Symbol.toPrimitive]() {
        if (target.maybeVariant) {
          target.classes.add(target.maybeVariant);
          target.maybeVariant = undefined;
        }

        return [...target.classes].join(' ');
      },
    });

    function spreadModifier(prefix: string, chunks: ToStringable) {
      for (const chunk of chunks.toString().split(' ')) {
        target.classes.add(`${prefix}${chunk}`);
      }
    }

    const thisTw: any = new Proxy(target, {
      get(target, p, _recv) {
        if (p === typewind_id) {
          return true;
        }

        if (p === 'toString' || p === 'valueOf' || p === Symbol.toPrimitive) {
          return target[Symbol.toPrimitive];
        }

        const isStrProp = ''[p as any] !== undefined;
        if (isStrProp) {
          const prim = target[Symbol.toPrimitive]();
          const value = prim[p as Exclude<keyof string, number>];
          return typeof value === 'function' ? value.bind(prim) : value;
        }

        if (typeof p !== 'string') return null;

        const name = fmtToTailwind(p);

        if (target.prevProp?.endsWith('-')) {
          target.classes.add(`${target.prevProp.slice(0, -1)}-[${p}]`);
        } else if (target.prevProp?.endsWith('/')) {
          target.classes.add(`${target.prevProp}${name}`);
        } else if (!name.endsWith('-') && !name.endsWith('/')) {
          if (target.maybeVariant) {
            target.classes.add(target.maybeVariant);
            target.maybeVariant = undefined;
          }

          if (name === 'raw') {
            return (style: ToStringable) => {
              spreadModifier('', style);
              return thisTw;
            };
          }

          if (name === 'variant') {
            return (modifier: string, classes: ToStringable) => {
              spreadModifier(`[${modifier}]:`, classes);
              return thisTw;
            };
          }

          if (name === 'important') {
            return (style: ToStringable) => {
              spreadModifier('!', style);
              return thisTw;
            };
          }

          target.maybeVariant = name;
        }

        target.prevProp = name;

        return thisTw;
      },
      apply(target, _thisArg, [style]) {
        const prefix = target.maybeVariant;

        if (!prefix) {
          throw new Error(
            'Typewind Error: unreachable code path, `maybeVariant` is undefined'
          );
        }

        target.maybeVariant = undefined;

        if (!style) {
          throw new Error(
            `Typewind Error: Passing a class to \`${prefix}\` is required`
          );
        }

        spreadModifier(`${prefix}:`, style);

        return thisTw;
      },
      getPrototypeOf() {
        return String.prototype;
      },
    });

    return thisTw;
  };

  const tw = new Proxy(
    {},
    {
      get(_target, p) {
        // @ts-ignore
        if (typeof p !== 'string') return Reflect.get(...arguments);

        return twUsed()[p];
      },
    }
  );

  return tw;
}
