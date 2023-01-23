import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Typewind</span>,
  project: {
    link: "https://github.com/mokshit06/typewind",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Typewind",
    };
  },
  docsRepositoryBase: "https://github.com/mokshit06/typewind",
  footer: {
    text: "Typewind",
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: "dark",
    forcedTheme: "dark",
  },
};

export default config;
