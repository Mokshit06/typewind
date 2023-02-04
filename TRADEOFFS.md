# Tradeoffs

## Benefits

- Typesafety

  Using TS intellisense and type generation, Typewind is able to provide type safety and autocomplete for all the classes based on `tailwind.config.js`. It can also catch typos and report incorrect classes.

  Typewind also works with all tailwind plugins, and provides type safety to them as well.

- CSS Docs on hover

  Typewind shows the CSS that tailwind would generate for each style on hovering over the property, as well as when typing them with autocomplete using JSDoc.

- Zero Bundle Size

  Typewind compiles away all the styles used, and converts them to static classes at build time. It adds 0 additional bytes to your bundle

- Grouped variants

  Managing multiple styles for a variant can get messy and hard to keep track of, for eg `hover:text-red-500 text-red-700 hover:text-sm`. Here we're having to specify `hover:` twice, and need to read all styles to find the hover variants.
  In typewind these can be grouped together `tw.text_red_700.hover(tw.text_red_500.text_sm)`.

- No need for extensions

  Since typewind uses Typescript for autocomplete as well as linting/type-checking, it doesn't require the setup of any additional editor extensions/eslint plugins to do this.

## Limitations

- Slightly slower build times

  Typewind's babel transform runs at compile time, so it does make the builds a bit slower. It also requires babel currently, so if you're using some other transpiler like SWC, you would need to switch to babel which would again slow down the builds.

- Doesn't support _every_ tailwind syntax.

  Typewind currently doesn't support some classes of tailwind, such as background opacity and named container queries. This is mostly because the syntax for them isn't finalised and due to the contrainsts of JS, we can't use seperators like `/` or `#`

- Odd formatting

  If you use arbitrary values, formatters like prettier might format the styles in an odd way, like moving the arbitrary part to new line.

- Doesn't sort classes using prettier

  Tailwind's prettier plugin for sorting classes based on recommended class order doesn't work with Typewind, but it might soon have a custom prettier plugin to support that.

- Only works in JS/TS files

  This library can only be used in TS and JS files as of now, and doesn't work in `.astro`, `.svelte` and `.mdx` files.
