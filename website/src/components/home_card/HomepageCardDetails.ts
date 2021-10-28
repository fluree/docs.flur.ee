import { CardDetails } from "../CardDetails.interface";

export const HomepageCardDetails: CardDetails[] = [
    {
        title: 'SmartFunctions',
        description: 'This is the SmartFunctions Card',
        link: '/docs/guides/advanced/smart-functions/1',
        Svg: require('../../../static/img/heroicons/acadmic-cap.svg').default
    },
    {
        title: 'Analytical Queries',
        description: 'This is the Analytical Queries Card',
        link: '/docs/guides/querying/query-advanced/5/',
        Svg: require('../../../static/img/heroicons/search-circle.svg').default
    },
    {
        title: 'Fluree Architecture',
        description: 'This is the Fluree Architecture Card',
        link: '/docs/concepts/architecture/flakes/',
        Svg: require('../../../static/img/heroicons/library.svg').default
    },
    {
        title: 'Transactions',
        description: 'This is the Transactions Card',
        link: '/docs/overview/transact/basics/',
        Svg: require('../../../static/img/heroicons/shield-check.svg').default
    },
    {
        title: 'APIs',
        description: 'This is the APIs Card',
        link: '/docs/reference/http/overview/',
        Svg: require('../../../static/img/heroicons/switch-horizontal.svg').default
    },
    {
        title: 'Schemas',
        description: 'This is the Schemas Card',
        link: '/docs/guides/schema/1/',
        Svg: require('../../../static/img/heroicons/book-open.svg').default
    }
];