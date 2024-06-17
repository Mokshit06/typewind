<h1 align="center"><img src="https://raw.githubusercontent.com/mokshit06/typewind/main/.github/typewind-logo.png" width="300px" /></h1>

<p align="center">
  The <em>safety</em> of Typescript with the <em>magic</em> of Tailwind. 💻
</p>

---

## Introduction

Typewind brings the safety, productivity and intellisense of Typescript over to Tailwind

```js
import { tw } from 'typewind';

const styles = tw.border.hover(tw.border_black);
```

## How it works

Typewind's compiler is a babel plugin that runs over your code, statically analyses it and converts all the `tw` styles into their corresponding Tailwind classes.

This results Typewind compiles away, leaving 0 runtime code.

```js
import { tw } from 'typewind';

const styles = tw.border.hover(tw.border_black);

// ↓ ↓ ↓ ↓ ↓ ↓

const styles = 'border hover:border-black';
```

## Features

**Zero bundle size** - Typewind compiles away all the styles used, and converts them to static classes at build

**Apply variants to multiple styles at once** - Since Typewind uses TS, it allows for more intuitive syntax for applying variants

```js
import { tw } from 'typewind';

const mediaStyles = tw.sm(tw.w_4.mt_3).lg(tw.w_8.mt_6);
const groupInGroups = tw.text_sm.sm(tw.bg_black.hover(tw.bg_white.w_10));
```

**Type safety and intellisense** - Using the TS compiler, Typewind is able to provide type safety to tailwind, and provide intellisense & autocomplete for all the classes from tailwind config.

```js
import { tw } from 'typewind';

const styles = tw.border_blackk; // ❌ Property 'border_blackk' does not exist on type 'Typewind'. Did you mean 'border_black'?
```

The above code would also return in a build error on running `tsc`

**Types generated from config** - Type definitions of `tw` are generated directly from your tailwind config, so it is always custom to you, and also creates types for custom theme palette and plugins.

## Hello

[![Powered by Vercel](https://raw.githubusercontent.com/mokshit06/typewind/main/.github/powered-by-vercel.svg)](https://vercel.com?utm_source=typewind&utm_campaign=oss)
