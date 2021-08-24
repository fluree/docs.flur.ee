/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
  overview: [
    'overview/about',
    // 'overview/faq',
    'overview/getting-started',
    {
      type: 'autogenerated',
      dirName: 'overview/start'
    },
    {
      type: 'category',
      label: 'Basics',
      collapsed: false,
      items: [
        'overview/fluree_basics',
        {
          type: 'category',
          label: 'Transact', items:
            [
              {
                type: 'autogenerated',
                dirName: 'overview/transact'
              }
            ]
        },
        {
          type: 'category',
          label: 'Schema', items:
            [
              {
                type: 'autogenerated',
                dirName: 'overview/schema'
              }
            ]
        },
        {
          type: 'category',
          label: 'Query', items:
            [
              {
                type: 'autogenerated',
                dirName: 'overview/query'
              }
            ]
        },
      ]
    },
    'overview/ledger-operations',
    'overview/on-demand'
  ],
  guides: [
    {
      type: 'autogenerated',
      dirName: 'guides'
    }
  ],
  reference: [
    {
      type: 'autogenerated',
      dirName: 'reference'
    }
  ],
  concepts: [
    'concepts/concepts',
    'concepts/what-is-fluree',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        { type: 'autogenerated', dirName: 'concepts/architecture' }
      ]
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        { type: 'autogenerated', dirName: 'concepts/infrastructure' }
      ]
    },
    {
      type: 'category',
      label: 'Identity',
      items: [
        { type: 'autogenerated', dirName: 'concepts/identity' }
      ]
    },
    {
      type: 'category',
      label: 'Smart Functions',
      items: [
        { type: 'autogenerated', dirName: 'concepts/smart-functions' }
      ]
    },
    {
      type: 'category',
      label: 'Analytical Queries',
      items: [
        { type: 'autogenerated', dirName: 'concepts/analytical-queries' }
      ]
    }
  ],
};
