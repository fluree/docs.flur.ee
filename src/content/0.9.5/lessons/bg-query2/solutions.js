export default { 
    "1": {"select": ["*"], "from": "actor", "limit": 50},
    "2": {"select": ["*"], "from": "credit", "limit": 10, "block": 3 },
    "3": {"select": ["*"], "from": "movie", "block": "2018-12-05T01:00:00.000Z0", "limit": 3},
    "4": {"select": ["*"], "from": "movie", "block": "PT2H10M", "limit": 2},
    "5": {"select": ["*"], "where": "movie/budget < 1000 OR movie/budget > 1000000"},
    "6": {
        "query1": {"select": ["*"], "from": "actor", "limit": 20},
        "query2": {"select": ["*"], "where": "movie/revenue < 200"},
        "query3": {"select": ["*"], "from": "movie", "block": "PT20M", "limit": 50},
        "query4": {"select": ["*"], "from": "credit", "block": "2018-01-01T18:30:00.000Z", "limit": 15},
        "query5": { "select": ["*"], "from": "movie", "block": 4, "limit": 200}
    }
}

                    