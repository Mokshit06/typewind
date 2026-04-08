import * as path from 'path';

// Use __dirname for stable path resolution regardless of cwd changes from other tests
const fixturesDir = path.resolve(__dirname, 'fixtures', 'normal-usage');

function loadCreateTw() {
  let createTw: any;
  jest.isolateModules(() => {
    createTw = require('../packages/typewind/src/evaluate').createTw;
  });
  return createTw;
}

describe('createTw (evaluate)', () => {
  const repoRoot = path.resolve(__dirname, '..');

  beforeEach(() => {
    process.chdir(fixturesDir);
  });

  afterAll(() => {
    process.chdir(repoRoot);
  });

  test('single class', () => {
    const tw = loadCreateTw()();
    expect(tw.border.toString()).toBe('border');
  });

  test('chained classes', () => {
    const tw = loadCreateTw()();
    expect(tw.border.rounded.flex.toString()).toBe('border rounded flex');
  });

  test('converts underscores to hyphens', () => {
    const tw = loadCreateTw()();
    expect(tw.bg_red_500.toString()).toBe('bg-red-500');
  });

  test('converts leading $ to @', () => {
    const tw = loadCreateTw()();
    expect(tw.$container.toString()).toBe('@container');
  });

  test('slash-separated values via $', () => {
    const tw = loadCreateTw()();
    expect(tw.text_blue_100$['25'].toString()).toBe('text-blue-100/25');
  });

  test('hover variant', () => {
    const tw = loadCreateTw()();
    expect(tw.hover(tw.bg_blue_600).toString()).toBe('hover:bg-blue-600');
  });

  test('chained variant with classes', () => {
    const tw = loadCreateTw()();
    expect(tw.bg_blue_500.hover(tw.bg_blue_600).toString()).toBe(
      'bg-blue-500 hover:bg-blue-600'
    );
  });

  test('variant with multiple classes', () => {
    const tw = loadCreateTw()();
    expect(tw.md(tw.py_4.px_5).toString()).toBe('md:py-4 md:px-5');
  });

  test('nested variants', () => {
    const tw = loadCreateTw()();
    expect(tw.dark(tw.hover(tw.bg_white)).toString()).toBe(
      'dark:hover:bg-white'
    );
  });

  test('important modifier', () => {
    const tw = loadCreateTw()();
    expect(tw.important(tw.text_red_500).toString()).toBe('!text-red-500');
  });

  test('raw helper', () => {
    const tw = loadCreateTw()();
    expect(tw.raw('s-1/2').toString()).toBe('s-1/2');
  });

  test('raw with other classes', () => {
    const tw = loadCreateTw()();
    expect(tw.border.raw('custom-class').toString()).toBe(
      'border custom-class'
    );
  });

  test('variant helper with arbitrary selector', () => {
    const tw = loadCreateTw()();
    expect(
      tw.variant('&:nth-child(3)', tw.underline).toString()
    ).toBe('[&:nth-child(3)]:underline');
  });

  test('arbitrary value via trailing underscore', () => {
    const tw = loadCreateTw()();
    expect(tw.text_.foo.toString()).toBe('text-[foo]');
  });

  test('symbol property returns null', () => {
    const tw = loadCreateTw()();
    const sym = Symbol('test');
    expect(tw.border[sym]).toBeNull();
  });

  test('toString via proxy get trap', () => {
    const tw = loadCreateTw()();
    const fn = tw.border.toString;
    expect(typeof fn).toBe('function');
    expect(fn()).toBe('border');
  });

  test('complex expression with variants, classes, raw, and important', () => {
    const tw = loadCreateTw()();
    const result = tw.bg_blue_500
      .hover(tw.bg_blue_600)
      .text_white.rounded.py_3.px_4
      .md(tw.py_4.px_5)
      .dark(tw.bg_sky_900.hover(tw.bg_sky_800))
      .important(tw.text_red_500)
      .hover(tw.important(tw.text_red_500))
      .raw('s-1/2')
      .toString();

    expect(result).toBe(
      'bg-blue-500 hover:bg-blue-600 text-white rounded py-3 px-4 md:py-4 md:px-5 dark:bg-sky-900 dark:hover:bg-sky-800 !text-red-500 hover:!text-red-500 s-1/2'
    );
  });

  test('responsive variants', () => {
    const tw = loadCreateTw()();
    expect(tw.sm(tw.w_4.mt_3).lg(tw.w_8.mt_6).toString()).toBe(
      'sm:w-4 sm:mt-3 lg:w-8 lg:mt-6'
    );
  });

  test('each tw access is independent', () => {
    const tw = loadCreateTw()();
    expect(tw.border.toString()).toBe('border');
    expect(tw.flex.toString()).toBe('flex');
  });
});
