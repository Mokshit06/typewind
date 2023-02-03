# Tradeoffs

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
