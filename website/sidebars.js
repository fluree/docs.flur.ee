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
      type: 'category',
      label: 'Start',
      items: [
        {
          type: 'autogenerated',
          dirName: 'overview/start'
        }
      ]
    },
    {
      type: 'category',
      label: 'Basics',
      collapsed: false,
      items: [
        'overview/fluree_basics',
        {
          type: 'category',
          label: 'Transact',
          items:
            [
              {
                type: 'autogenerated',
                dirName: 'overview/transact'
              }
            ]
        },
        {
          type: 'category',
          label: 'Schema',
          items:
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
    'overview/on-demand',
    {
      type: 'category',
      label: 'Example Apps',
      items: [
        {
          type: 'category',
          label: 'Create a cryptocurrency',
          items: [
            {
              type: 'autogenerated',
              dirName: 'overview/demos/cryptocurrency'
            }
          ]
        },
        {
          type: 'category',
          label: 'Create a voting app',
          items: [
            {
              type: 'autogenerated',
              dirName: 'overview/demos/voting-app'
            }
          ]
        }
      ]
    }
  ],
  guides: [
    'guides/guides',
    {
      type: 'autogenerated',
      dirName: 'overview/start'
    },
    {
      type: 'category',
      label: 'Schema',
      collapsed: false,
      items: [
        { type: 'autogenerated', dirName: 'guides/schema' }
      ]
    },
    {
      type: 'category',
      label: 'Transactions',
      items: [
        { type: 'autogenerated', dirName: 'guides/transactions' }
      ]
    },
    {
      type: 'category',
      label: 'FlureeQL Queries',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Query - Basics',
          items: [
            { type: 'autogenerated', dirName: 'guides/querying/query-basics' }
          ]
        },
        {
          type: 'category',
          label: 'Query - Intermediate',
          items: [
            { type: 'autogenerated', dirName: 'guides/querying/query-intermediate' }
          ]
        },
        {
          type: 'category',
          label: 'Query - Advanced',
          items: [
            { type: 'autogenerated', dirName: 'guides/querying/query-advanced' }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'GraphQL',
      items: [
        { type: 'autogenerated', dirName: 'guides/graphql' }
      ]
    },
    {
      type: 'category',
      label: 'SPARQL',
      items: [
        { type: 'autogenerated', dirName: 'guides/sparql' }
      ]
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        {
          type: 'category',
          label: 'API',
          items: [
            { type: 'autogenerated', dirName: 'guides/advanced/api' }
          ]
        },
        {
          type: 'category',
          label: 'Cryptography',
          items: [
            { type: 'autogenerated', dirName: 'guides/advanced/cryptography' }
          ]
        },
        {
          type: 'category',
          label: 'Flakes and Blocks',
          items: [
            { type: 'autogenerated', dirName: 'guides/advanced/flakes-and-blocks' }
          ]
        },
        {
          type: 'category',
          label: 'Permissions',
          items: [
            { type: 'autogenerated', dirName: 'guides/advanced/permissions' }
          ]
        },
        {
          type: 'category',
          label: 'Smart Functions',
          items: [
            { type: 'autogenerated', dirName: 'guides/advanced/smart-functions' }
          ]
        }
      ]
    },
    'guides/tools'
  ],
  reference: [
    'reference/reference',
    {
      type: 'category',
      label: 'HTTP endpoints',
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'reference/http'
        }
      ]
    },
    'reference/clojure',
    {
      type: 'category',
      label: 'Nodejs Library',
      items: [
        {
          type: 'autogenerated',
          dirName: 'reference/nodejs'
        }
      ]
    },
    {
      type: 'category',
      label: 'Javascript Library',
      items: [
        {
          type: 'autogenerated',
          dirName: 'reference/javascript'
        }
      ]
    },
    {
      type: 'category',
      label: 'Service Worker',
      items: [
        {
          type: 'autogenerated',
          dirName: 'reference/serviceworker'
        }
      ]
    },
    'reference/crypto',
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
  reference: [
    {
      type: 'autogenerated',
      dirName: 'reference'
    }
  ]
}
