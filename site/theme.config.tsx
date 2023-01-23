import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span className="mx-2 font-extrabold hidden md:inline select-none">Typewind</span>,
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
    text: "Typewind, MIT 2023 © Mokshit Jain.",
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: "dark",
    forcedTheme: "dark",
  },
};

export default config;
