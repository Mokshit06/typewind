import React from 'react';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';
import { tw } from 'typewind';

const config: DocsThemeConfig = {
  logo: (
    <span
      className={
        tw.text_base.md(tw.text_lg).mx_2.font_extrabold.inline.select_none
      }
      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
    >
      type
      <span
        className={
          tw.underline.decoration_wavy.decoration_red_500.text_white
            .underline_offset_4
        }
      >
        wind
      </span>
    </span>
  ),
  project: {
    link: 'https://github.com/mokshit06/typewind',
  },
  useNextSeoProps() {
    const { route } = useRouter();

    if (route === '/')
      return {
        titleTemplate: 'Typewind – %s',
      };

    return {
      titleTemplate: '%s – Typewind',
    };
  },
  docsRepositoryBase: 'https://github.com/mokshit06/typewind/blob/main/site',
  footer: {
    text: 'Typewind, MIT 2023 © Mokshit Jain.',
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: 'dark',
    forcedTheme: 'dark',
  },
  head: () => {
    const { frontMatter: meta } = useConfig();
    const { title } = meta;

    return (
      <>
        <link rel="mask-icon" href="/apple-touch-icon.png" color="#000000" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={
            meta['description'] ||
            'The safety of Typescript with the magic of Tailwind.'
          }
        />
        <meta
          name="og:description"
          content={
            meta['description'] ||
            'The safety of Typescript with the magic of Tailwind.'
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mokshit06" />
        <meta
          name="og:title"
          content={
            title
              ? title + ' – Typewind'
              : 'Typewid - The safety of Typescript with the magic of Tailwind.'
          }
        />
        <meta name="apple-mobile-web-app-title" content="Typewind" />
      </>
    );
  },
};

export default config;
