const libNav0110_pre = {
    "intro": {
        "pageName": "Intro",
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "0.11.0/library/intro/overview"
            }
        }
    }
}


const libNav0110 = {
    "intro": {
        "pageName": "Intro",
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "0.11.0/library/intro/overview"
            }
        }
    },
    "javascript-library": {
        "pageName": "JavaScript Library",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "0.11.0/library/javascript-library/javascript-overview"
            },
            "javascript-examples": {
                "headerName": "Examples",
                "file": "0.11.0/library/javascript-library/javascript-examples"
            }
        }
    }
}


function transformations0110(nav){
    return nav
}


export function getLibNav(version){
    if(version === "0.9.1"){
        return libNav0110_pre
    } else if (version === "0.10.0"){
        return libNav0110_pre
    } else if (version === "0.11.0"){
        return libNav0110;
    } else if (version === "0.12.0"){
        let copy0110 = Object.assign({}, libNav0110)
        let libNav0120 = transformations0110(copy0110);
        return libNav0120;
    }
}