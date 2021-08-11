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
  docs: [
    'tutorials/tutorial_intro',
    {
      type: 'category',
      label: 'Tutorial - Basics',
      items: [
        {
          type: 'autogenerated',
          dirName: 'tutorials/tutorial-basics',
        }
      ]
    },
    {
      type: 'category',
      label: 'Tutorial - Extras',
      items: [
        {
          type: 'autogenerated',
          dirName: 'tutorials/tutorial-extras',
        }
      ]
    }
  ],
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
  concepts: [
    { type: 'autogenerated', dirName: 'concepts'}
  ]
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};
