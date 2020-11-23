export default { 
    "1": {"select": ["*"], "from": "_collection"},
    "2": {"select": ["*"], "from": "actor" },
    "3": {"select": ["*"], "from": ["movie/title", "Titanic"]},
    "4": {
        "query1": {"select": ["*"], "from": "language"},
        "query2": {"select": ["*"], "from": ["productionCompany/name", "Miramax"]},
        "query3": {"select": ["*"], "from": 1893207}
         },
    "5": {"select": ["movie/credits", "movie/title"], "from": ["movie/title", "Titanic"]},
    "6": {
            "queryAnswer": {"select": ["*"], "from": "_predicate/unique"},
            "quizAnswer": ["B is correct! There may be predicates in our ledgers where",
             "we've set _predicate/unique to false. This query returns any",
             "predicates that have the _predicate/unique predicate",
             "- whether true or false"]},
    "7": { 
        "select": ["*", {"movie/productionCompanies": ["*"]}],
        "from": "movie"},
    "8":
        "No Question = No Solution :)"
         ,
    "9": {
            "select": ["*", {"movie/_productionCompanies": ["*"]}],
            "from": "productionCompany"},
    "10": {
        "query1": {"select": ["*"], "from": "credit"},
        "query2": {"select": ["genre/name"], "from": "genre"},
        "query3": {"select": ["*"], "from": 4316442151189},
        "query4": {"select": ["*", {"credit/_actor": ["*"]}], "from": ["actor/name", "Brad Pitt"]},
        "query5": {"select": ["*", {"credit/actor": ["*"]}], "from": "credit"},
        "query6": {"select": ["*"], "from": "movie/budget"}
    }
    
            
}

                    