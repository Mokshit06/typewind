import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';

const config: DocsThemeConfig = {
  logo: (
    <span className="mx-2 font-extrabold hidden md:inline select-none">
      Typewind
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
};

export default config;
