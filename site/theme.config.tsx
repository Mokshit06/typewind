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
            .underline_offset_1
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
  docsRepositoryBase: 'https://github.com/mokshit06/typewind',
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
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={
            meta.description ||
            'The safety of Typescript with the magic of Tailwind.'
          }
        />
        <meta
          name="og:description"
          content={
            meta.description ||
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
