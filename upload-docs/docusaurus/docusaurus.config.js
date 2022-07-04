module.exports = {
  title: 'Documentation validation',
  tagline: 'Documentation validation',
  url: 'https://docs-test.private.e-conomic.ws',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  organizationName: 'e-conomic',
  projectName: 'documentation validation',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/e-conomic/github-actions/tree/master/upload-docs',
        }
      },
    ],
  ],
  plugins: [
    require.resolve('@cmfcmf/docusaurus-search-local')
  ]
};
