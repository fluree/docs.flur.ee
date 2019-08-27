const staticLessonNav095 = {
    "bg-query": {
        "numLessons": 10,
        "icon": "fas fa-question-circle",
        "class": "beginner",
        "title": "Basics: Querying #1",
        "description": "Learn the basics of querying in FlureeQL.",
        "location": "0.9.5/lessons/bg-query"
    },
    "bg-query2": {
        "numLessons": 6,
        "icon": "fas fa-question-circle",
        "class": "beginner",
        "title": "Basics: Querying #2",
        "description": "Learn the basics of querying in FlureeQL.",
        "location": "0.9.5/lessons/bg-query2"
    },
    "bg-schema": {
        "numLessons": 7,
        "icon": "far fa-building",
        "class": "beginner",
        "title": "Basics: Schema",
        "description": "Create your own collections and predicates with FlureeQL.",
        "location": "0.9.5/lessons/bg-schema"
    },
    "bg-transact": {
        "numLessons": 9,
        "icon": "fas fa-wrench",
        "class": "beginner",
        "title": "Basics: Transacting",
        "description": "Add, update, and delete data with FlureeQL.",
        "location": "0.9.5/lessons/bg-transact"
    },
    "bg-api": {
        "numLessons": 6,
        "icon": "fas fa-cogs",
        "class": "beginner",
        "title": "Basics: API",
        "description": "Make requests to API endpoints in Fluree.",
        "location": "0.9.5/lessons/bg-api"
    },
    "bg-infra": {
        "numLessons": 7,
        "icon": "fas fa-industry",
        "class": "beginner",
        "title": "Basics: Infrastructure",
        "description": "Understand flakes, triples, and general Fluree infrastructure.",
        "location": "0.9.5/lessons/bg-infra"
    },
    "im-query": {
        "numLessons": 10,
        "icon": "fas fa-question-circle",
        "class": "intermediate",
        "title": "Intermediate: Query",
        "description": "Block, history, and analytical queries using FlureeQL.",
        "location": "0.9.5/lessons/im-query"
    },
    "im-smart-functions": {
        "numLessons": 11,
        "icon": "far fa-file-code",
        "class": "intermediate",
        "title": "Intermediate: Smart Functions",
        "description": "Learn how smart functions work and create basic ones.",
        "location": "0.9.5/lessons/im-smart-functions"
    },
    "im-permissions": {
        "numLessons": 5,
        "icon": "far fa-file-code",
        "class": "intermediate",
        "title": "Intermediate: Permissions",
        "description": "Learn how rules and permissions work in Fluree.",
        "location": "0.9.5/lessons/im-permissions"
    },
    "im-cryptography": {
        "numLessons": 5,
        "icon": "fas fa-key",
        "class": "intermediate",
        "title": "Intermediate: Cryptography",
        "description": "Learn about the cryptography behind Fluree.",
        "location": "0.9.5/lessons/im-cryptography"
    },
    "supp-graphql": {
        "numLessons": 11,
        "icon": "fas fa-chart-pie",
        "class": "example",
        "title": "Supplementary: GraphQL",
        "description": "Query and transact in GraphQL.",
        "location": "0.9.5/lessons/supp-graphql"
    },
    "supp-sparql": {
        "numLessons": 10,
        "icon": "fas fa-chart-pie",
        "class": "example",
        "title": "Supplementary: SPARQL",
        "description": "Query in SPARQL.",
        "location": "0.9.5/lessons/supp-sparql"
    },
    "ex-crypto": {
        "numLessons": 11,
        "icon": "fas fa-coins",
        "class": "example",
        "title": "Example: Cryptocurrency",
        "description": "Build your own (simple) cryptocurrency.",
        "location": "0.9.5/lessons/ex-crypto"
    },
    "ex-voting": {
        "numLessons": 15,
        "icon": "fas fa-person-booth",
        "class": "example",
        "title": "Example: Voting",
        "description": "Build your own voting mechanism.",
        "location": "0.9.5/lessons/ex-voting"
    }
}

function transformations095(nav) {
    // Need to set entire value, otherwise it changes to original. Damn JS mutable objects.
    nav["im-smart-functions"] = {
        "numLessons": 11,
        "icon": "far fa-file-code",
        "class": "intermediate",
        "title": "Intermediate: Smart Functions",
        "description": "Learn how smart functions work and create basic ones.",
        "location": "0.9.6/lessons/im-smart-functions"
    }

    nav["ex-crypto"] = {
        "numLessons": 11,
        "icon": "fas fa-coins",
        "class": "example",
        "title": "Example: Cryptocurrency",
        "description": "Build your own (simple) cryptocurrency.",
        "location": "0.9.6/lessons/ex-crypto"
    }

    nav["ex-voting"] = {
        "numLessons": 15,
        "icon": "fas fa-person-booth",
        "class": "example",
        "title": "Example: Voting",
        "description": "Build your own voting mechanism.",
        "location": "0.9.6/lessons/ex-voting"
    }
    return nav
}

function transformations096(nav) {
    return nav
}

export function getLessonNav(version) {

    if (version === "0.9.1") {
        return null
    } else if (version === "0.9.5") {
        return staticLessonNav095

    } else if (version === "0.9.6") {

        let lessonNav095 = Object.assign({}, staticLessonNav095)
        let lessonNav096 = transformations095(lessonNav095);
        return lessonNav096;

    } else if (version === "0.9.7") {
        let lessonNav095 = Object.assign({}, staticLessonNav095)
        let lessonNav096 = transformations095(lessonNav095);
        let lessonNav097 = transformations096(lessonNav096);
        return lessonNav097;
    }
}