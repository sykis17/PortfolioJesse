// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PortfolioJesse',
  tagline: 'Jesse Portfolio Documentation',
  favicon: 'img/favicon.ico',

  url: 'https://sykis17.github.io', 
  baseUrl: '/PortfolioJesse/', 

  organizationName: 'sykis17',
  projectName: 'PortfolioJesse',
  deploymentBranch: 'gh-pages',
  trailingSlash: false, 

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fi'],
    localeConfigs: {
      en: { label: 'English', htmlLang: 'en-US' },
      fi: { label: 'Suomi', htmlLang: 'fi-FI' },
    },
  },
  
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', 
          exclude: ['archive/**'],
        },
        blog: false, 
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  customFields: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'log',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    '@docusaurus/theme-live-codeblock',
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "fi"],
        docsRouteBasePath: "/", 
        indexDocs: true,
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'forest' },
      },
      navbar: {
        title: 'PortfolioJesse',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'PortfolioJesseSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value: '<button onclick="window.print()" style="cursor:pointer; background: #2563eb; color: white; border: none; padding: 6px 15px; border-radius: 8px; font-weight: bold; margin-left: 10px; font-size: 12px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">📄 PDF / Print</button>',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} PortfolioJesse. Built with Docusaurus.`,
      },
    }),
};

module.exports = config;