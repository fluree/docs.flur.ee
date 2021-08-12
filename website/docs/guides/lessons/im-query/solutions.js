export default { 
    "1": { "block": "P3M2DT6H2M"},
    "2": { "block": [21] },
    "3": { "history": 1234, "block": 8 },
    "4": { "history": [1234, "person/handle"] },
    "5": ["A. All variables in select",
        "need to be declared in ",
        "the where clause"],
    "6": [{
        "select": ["?handle", "?fullName"],
        "where": [[1234, "person/handle", "?handle"],
            [1234, "person/fullName", "?fullName"]]
    }, "Note: Your variable name (?fullName)",
"might be different. ", "This is fine", "as long as it's",
"consisten across the select",
"and where clauses"],
    "7": ["B. The results will show us",
    "shared favorite numbers"],
    "8": {
        "select": "?artists",
        "where": [ 
            ["$fdb18", 
            ["person/handle", "zsmith"], 
            "person/favArtists", "?artists"], 
            
            ["$fdb10", 
            ["person/handle", "jdoe"], 
            "person/favArtists", 
            "?artists"] ]
    },
    "9": {
            "select": "(rand ?nums)",
            "where": [ 
                ["$fdb8", 
                ["person/handle", "zsmith"], 
                "person/favNums", "?nums"]
                ]
        },
    "10": ["(♥_♥)", "Nothing to see here", "Congrats on finishing",
    "another section"]
}

                    