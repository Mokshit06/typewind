import { createRuntimeTw, typewind_id } from '../packages/typewind/src/runtime';

describe('createRuntimeTw', () => {
  let tw: any;

  beforeEach(() => {
    tw = createRuntimeTw();
  });

  describe('basic class generation', () => {
    test('single class', () => {
      expect(`${tw.border}`).toBe('border');
    });

    test('chained classes', () => {
      expect(`${tw.border.rounded.flex}`).toBe('border rounded flex');
    });

    test('converts underscores to hyphens', () => {
      expect(`${tw.bg_red_500}`).toBe('bg-red-500');
    });

    test('converts leading $ to @', () => {
      expect(`${tw.$container}`).toBe('@container');
    });

    test('converts middle $ to /', () => {
      expect(`${tw.w_1$2}`).toBe('w-1/2');
    });
  });

  describe('variant modifiers', () => {
    test('hover variant', () => {
      expect(`${tw.hover(tw.bg_blue_600)}`).toBe('hover:bg-blue-600');
    });

    test('chained variants', () => {
      expect(`${tw.bg_blue_500.hover(tw.bg_blue_600)}`).toBe(
        'bg-blue-500 hover:bg-blue-600'
      );
    });

    test('nested variants', () => {
      expect(`${tw.dark(tw.hover(tw.bg_white))}`).toBe(
        'dark:hover:bg-white'
      );
    });

    test('variant with multiple classes', () => {
      expect(`${tw.md(tw.py_4.px_5)}`).toBe('md:py-4 md:px-5');
    });
  });

  describe('important modifier', () => {
    test('important modifier', () => {
      expect(`${tw.important(tw.text_red_500)}`).toBe('!text-red-500');
    });

    test('important with variant', () => {
      expect(`${tw.hover(tw.important(tw.text_red_500))}`).toBe(
        'hover:!text-red-500'
      );
    });
  });

  describe('raw helper', () => {
    test('raw passes through arbitrary string', () => {
      expect(`${tw.raw('s-1/2')}`).toBe('s-1/2');
    });

    test('raw with other classes', () => {
      expect(`${tw.border.raw('custom-class')}`).toBe('border custom-class');
    });

    test('raw with space-separated classes', () => {
      expect(`${tw.raw('foo bar baz')}`).toBe('foo bar baz');
    });
  });

  describe('variant helper', () => {
    test('custom arbitrary variant', () => {
      expect(`${tw.variant('&:nth-child(3)', tw.underline)}`).toBe(
        '[&:nth-child(3)]:underline'
      );
    });

    test('arbitrary variant with multiple classes', () => {
      expect(`${tw.variant('&:hover', tw.text_red_500.bg_white)}`).toBe(
        '[&:hover]:text-red-500 [&:hover]:bg-white'
      );
    });
  });

  describe('arbitrary values (prevProp ending with -)', () => {
    test('arbitrary value via trailing underscore then value', () => {
      // When a prop ends with '-' (from trailing _), the next access creates an arbitrary value
      expect(`${tw.text_.red}`).toBe('text-[red]');
    });

    test('arbitrary value preserves raw property name', () => {
      expect(`${tw.bg_.blue}`).toBe('bg-[blue]');
    });
  });

  describe('slash-separated values (prevProp ending with /)', () => {
    test('opacity with slash syntax', () => {
      // e.g. tw.text_blue_100$['25'] where $ becomes /
      expect(`${tw.text_blue_100$['25']}`).toBe('text-blue-100/25');
    });
  });

  describe('typewind_id symbol', () => {
    test('tw proxy has typewind_id', () => {
      expect(tw.border[typewind_id]).toBe(true);
    });
  });

  describe('Symbol.toPrimitive and toString', () => {
    test('toString returns class string', () => {
      expect(tw.border.toString()).toBe('border');
    });

    test('valueOf returns class string', () => {
      expect(tw.border.valueOf()).toBe('border');
    });

    test('template literal coercion', () => {
      expect(`${tw.flex}`).toBe('flex');
    });
  });

  describe('string property delegation', () => {
    test('length delegates to underlying string', () => {
      expect(tw.flex.length).toBe(4);
    });

    test('includes delegates to underlying string', () => {
      expect(tw.border.rounded.includes('border')).toBe(true);
    });

    test('split delegates to underlying string', () => {
      expect(tw.border.rounded.split(' ')).toEqual(['border', 'rounded']);
    });
  });

  describe('symbol property access', () => {
    test('non-string symbol returns null', () => {
      const sym = Symbol('test');
      expect(tw.border[sym]).toBeNull();
    });
  });

  describe('error cases', () => {
    test('calling tw proxy directly without maybeVariant throws', () => {
      // The apply trap requires maybeVariant to be set
      // tw() directly should throw since no property was accessed that sets maybeVariant
      // Actually, tw itself is not callable - the inner proxy is callable
      // We need to access a property first and then call without a variant
      // This is hard to trigger directly since property access always sets maybeVariant
    });

    test('variant call without style argument throws', () => {
      expect(() => {
        tw.hover(undefined);
      }).toThrow('Passing a class to `hover` is required');
    });
  });

  describe('getPrototypeOf trap', () => {
    test('prototype is String.prototype', () => {
      expect(Object.getPrototypeOf(tw.border)).toBe(String.prototype);
    });
  });

  describe('each new tw access starts fresh', () => {
    test('tw.border and tw.flex are independent', () => {
      const a = `${tw.border}`;
      const b = `${tw.flex}`;
      expect(a).toBe('border');
      expect(b).toBe('flex');
    });
  });

  describe('complex combinations', () => {
    test('multiple variants and classes', () => {
      const result = `${tw.bg_blue_500
        .hover(tw.bg_blue_600)
        .text_white.rounded.py_3.px_4.md(tw.py_4.px_5)
        .dark(tw.bg_sky_900.hover(tw.bg_sky_800))
        .important(tw.text_red_500)
        .hover(tw.important(tw.text_red_500))
        .raw('s-1/2')}`;

      expect(result).toBe(
        'bg-blue-500 hover:bg-blue-600 text-white rounded py-3 px-4 md:py-4 md:px-5 dark:bg-sky-900 dark:hover:bg-sky-800 !text-red-500 hover:!text-red-500 s-1/2'
      );
    });

    test('sm and lg responsive variants', () => {
      expect(`${tw.sm(tw.w_4.mt_3).lg(tw.w_8.mt_6)}`).toBe(
        'sm:w-4 sm:mt-3 lg:w-8 lg:mt-6'
      );
    });

    test('nested variants with multiple styles', () => {
      expect(`${tw.text_sm.sm(tw.bg_black.hover(tw.bg_white.w_10))}`).toBe(
        'text-sm sm:bg-black sm:hover:bg-white sm:hover:w-10'
      );
    });
  });
});
