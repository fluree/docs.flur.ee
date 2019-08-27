const apiNav091 = {
    "intro": {
        "pageName": "Endpoints",
        "subTopics": {
            "intro": {
                "headerName": "Endpoints",
                "file": "0.9.1/api/all"
            }
        }
    }
}

const apiNav095 = {
    "intro": {
        "pageName": "Intro",
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "0.9.5/api/intro/overview"
            }
        }
    },
    "downloaded-endpoints": {
        "pageName": "Downloaded Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "0.9.5/api/downloaded-endpoints/downloaded-overview"
            },
            "downloaded-examples": {
                "headerName": "Examples",
                "file": "0.9.5/api/downloaded-endpoints/downloaded-examples"
            }
        }
    },
    "hosted-endpoints": {
        "pageName": "Hosted Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "0.9.5/api/hosted-endpoints/hosted-overview"
            },
            "getting-tokens": {
                "headerName": "Getting Tokens",
                "file": "0.9.5/api/hosted-endpoints/getting-tokens"
            },
            "hosted-examples": {
                "headerName": "Examples",
                "file": "0.9.5/api/hosted-endpoints/hosted-examples"
            }
        }
    }
}

export const endpointMap = {
    "0.9.1": [ "graphql", "query", "token", "transact"],
    "0.9.5": [ "block", "graphql", "history", "multi-query", "query", "signin", "sparql", "transact"],
    "0.9.6": [ "block", "graphql", "history", "multi-query", "query", "sparql", "transact", "gen-flakes", "query-with", "test-transact-with"] 
}

function transformations095(nav){

    nav["downloaded-endpoints"] = {
        "pageName": "Downloaded Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "0.9.6/api/downloaded-endpoints/downloaded-overview"
            },
            "downloaded-examples": {
                "headerName": "Examples",
                "file": "0.9.6/api/downloaded-endpoints/downloaded-examples"
            }
        }
    }

    nav["hosted-endpoints"] = {
        "pageName": "Hosted Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "0.9.6/api/hosted-endpoints/hosted-overview"
            }
        }
    }

    return nav
}

function transformations096(nav){
    return nav
}

export function getAPINav(version){
    if(version === "0.9.1"){
        return apiNav091
    } else if (version === "0.9.5"){
        return apiNav095
    } else if (version === "0.9.6"){
        let copy095 = Object.assign({}, apiNav095)
        let apiNav096 = transformations095(copy095);
        return apiNav096;
    } else if (version === "0.9.7"){
        let copy095 = Object.assign({}, apiNav095)
        let apiNav096 = transformations095(copy095);
        let apiNav097 = transformations096(apiNav096);
        return apiNav097;
    }
}