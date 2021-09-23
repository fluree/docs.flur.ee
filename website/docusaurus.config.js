const lightCodeTheme = require('prism-react-renderer/themes/okaidia');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Fluree Docs',
  tagline: 'Semantic graph data management system built with web3 tech',
  url: 'https://docs.flur.ee',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'fluree', 		// GitHub org name.
  projectName: 'docs.flur.ee', 		// Repo name.
  themeConfig: {
	colorMode: {

		// light | dark
		defaultMode: 'light',

		// remove default sun-moon icons for dark mode switch
		switchConfig: {
			darkIcon: ' ',
			lightIcon: ' '
		}
	},
    navbar: {
      // title: 'Fluree',
      hideOnScroll: true,
      logo: {
        alt: 'Fluree Yeti Logo',
        src: 'img/dark_horizontal.svg',
        srcDark: 'img/white_horizontal.svg',
        href: 'https://flur.ee'
      },

	  // Navbar links - left aligned
      items: [
        {
          to: '/',
          position: 'left',
          label: '/Docs',
          className: 'navbar-home-link'
        },
        {
          type: 'doc',
          docId: 'overview/about',
          position: 'left',
          label: 'Overview',
        },
        {
          to: '/guides',
          docId: 'guides/guides',
          type: 'doc',
          position: 'left',
          label: 'Guides'
        }, 
        {
          to: '/refence',
          docId: 'reference/reference',
          type: 'doc',
          position: 'left',
          label: 'Reference'
        },
        {
          to: '/concepts',
          docId: 'concepts/concepts',
          type: 'doc',
          position: 'left',
          label: 'Concepts'
        },
        {
          type: 'doc',
          docId: 'community',
          label: 'Community',
          position: 'left'
        },

        // Docusaurus template stuff
        // { to: '/blog', label: 'Blog', position: 'left' },

        // Navbar links - right aligned
        {
          href: 'https://github.com/fluree/docs.flur.ee',
          className: 'header-github-link',
          position: 'right',
          'aria-label': 'Github repository'
        },
      ],
    },
    // Config for collapsing sidebar
    hideableSidebar: true,

    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          // items: [
          //   {
          //     label: 'Tutorial',
          //     to: 'docs/tutorials/tutorial_intro',
          //   },
          // ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Slack',
              href: 'https://launchpass.com/flureedb',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/flureepbc',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'Github',
              href: 'https://github.com/fluree',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fluree, PBC. Built with Docusaurus.`
    },
	// Config for themeing syntax highlighting
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['turtle', 'sparql', 'clojure', 'http', 'xml-doc']
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/fluree/docs.flur.ee/tree/docs-overhaul/website',
        },
        // blog: {
        //   showReadingTime: true,
        //   // TODO: Please change this to your repo.
        //   editUrl:
        //     'https://github.com/fluree/docs.flur.ee',
        //   // editUrl:
        //   //   'https://github.com/fluree/docs.flur.ee/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
