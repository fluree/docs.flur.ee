export default { 
    "1": ["@('_')@", "There aren't any challenges this round, silly!"],
    "2": "c",
    "3": "{ graph { person { handle fullName } } }",
    "4": "{ graph { chat { message instant _id } artist { name } comment { message } person { favNums }  } }",
    "5": "{ graph { person { handle fullName favArtists { name } } }",
    "6": "{ graph { chat { * } person { * } artist { * } } }",
    "7": "{ graph { artist { person_Via_artist { handle fullName } } }",
    "8": "{ graph { chat (sort: {predicate: \"message\", order: ASC}) { message person (sort: {predicate: \"handle\", order: ASC}) { handle fullName favArtists (sort: {predicate: \"name\", order: ASC}) { name } } } } }",
    "9": "query { block(from: 4, to: 6) }",
    "10": "mutation addArtists ($artistTx: JSON) { transact(tx: $artistTx) }",
    "11": ["((̲̅ ̲̅(̲̅C̲̅r̲̅a̲̅y̲̅o̲̅l̲̲̅̅a̲̅( ̲̅((>", "Onward and upward! You're all done with this lesson"]
}

                    