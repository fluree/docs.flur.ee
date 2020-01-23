// API Navs

const apiNav0_9_1 = require('./nav_maps/apiNav0_9_1.json');
const apiNav0_10_0 = require('./nav_maps/apiNav0_10_0.json');
const apiNav0_11_0 = require('./nav_maps/apiNav0_11_0.json');
const apiNav0_12_0 = require('./nav_maps/apiNav0_12_0.json');
const apiNav0_13_0 = require('./nav_maps/apiNav0_13_0.json');

// Docs Navs

const docNav0_9_1 = require('./nav_maps/docNav0_9_1.json');
const docNav0_10_0 = require('./nav_maps/docNav0_10_0.json');
const docNav0_11_0 = require('./nav_maps/docNav0_11_0.json');
const docNav0_12_0 = require('./nav_maps/docNav0_12_0.json');
const docNav0_13_0 = require('./nav_maps/docNav0_13_0.json');

// Lesson Navs

const lessonNav0_10_0 = require('./nav_maps/lessonNav0_10_0');
const lessonNav0_11_0 = require('./nav_maps/lessonNav0_11_0');

// Lib Navs

const libNav0_10_0 = require('./nav_maps/libNav0_10_0.json');
const libNav0_11_0 = require('./nav_maps/libNav0_11_0.json');

// Video Navs
const videoNav0_10_0 = require('./nav_maps/videoNav0_10_0.json');


export const endpointMap = {
    "0.9.1": [ "graphql", "query", "token", "transact"],
    "0.10.0": [ "block", "graphql", "history", "multi-query", "query", "signin", "sparql", "transact"],
    "0.11.0": [ "block", "graphql", "history", "multi-query", "query", "sparql", "transact", "gen-flakes", "query-with", "test-transact-with"],
    "0.12.0": [ "block", "graphql", "history", "multi-query", "query", "sparql", "transact", "gen-flakes", "query-with", "test-transact-with"] ,
    "0.13.0": [ "block", "graphql", "history", "multi-query", "query", "sparql", "transact", "gen-flakes", "query-with", "test-transact-with"] 
}

export const languageMap = {
    "0.9.1": ["flureeql", "graphql", "curl"],
    "0.10.0": ["flureeql", "graphql", "curl", "sparql"],
    "0.11.0": ["flureeql", "graphql", "curl", "sparql"],
    "0.12.0": ["flureeql", "graphql", "curl", "sparql"],
    "0.13.0": ["flureeql", "graphql", "curl", "sparql"]
}

export function getAPINav(version){
    if(version === "0.9.1"){
        return apiNav0_9_1
    } else if (version === "0.10.0"){
        return apiNav0_10_0
    } else if (version === "0.11.0"){
        return apiNav0_11_0;
    } else if (version === "0.12.0"){
        return apiNav0_12_0;
    } else if (version === "0.13.0"){
        return apiNav0_13_0;
    }
}

export function getDocNav(version){
    if(version === "0.9.1"){
        return docNav0_9_1
    } else if (version === "0.10.0"){
        return docNav0_10_0
    } else if (version === "0.11.0"){
        return docNav0_11_0;
    } else if (version === "0.12.0"){
        return docNav0_12_0;
    } else if (version === "0.13.0"){
        return docNav0_13_0;
    }
}

export function getLessonNav(version) {
    if (version === "0.9.1") {
        return null
    } else if (version === "0.10.0") {
        return lessonNav0_10_0
    } else if (version === "0.11.0") {
        return lessonNav0_11_0;
    } else if (version === "0.12.0") {
        return lessonNav0_11_0;
    } else if (version === "0.13.0") {
        return lessonNav0_11_0;
    }
}

export function getLibNav(version){
    if(version === "0.9.1"){
        return libNav0_10_0;
    } else if (version === "0.10.0"){
        return libNav0_10_0;
    } else if (version === "0.11.0"){
        return libNav0_11_0;
    } else if (version === "0.12.0"){
        return libNav0_11_0;
    } else if (version === "0.13.0"){
        return libNav0_11_0;
    }
}

export function getVideoNav(version) {
    if (version === "0.9.1") {
        return null
    } else if (version === "0.10.0") {
        return videoNav0_10_0;
    } else if (version === "0.11.0") {
        return videoNav0_10_0;
    } else if (version === "0.12.0") {
        return videoNav0_10_0;
    } else {
        return videoNav0_10_0;
    }
}