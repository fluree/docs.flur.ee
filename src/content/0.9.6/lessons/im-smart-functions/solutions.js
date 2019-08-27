export default { 
    "1": "This is a true fact!",
    "2": [{
        "_id":  "_fn",
        "name": "add10",
        "params": ["b"],
        "code": "(+ b 10)",
        "doc": "Adds 10 to a value, b."
    }],
    "3": ["(+ (min 16 10 23) 45)", 55],
    "4": [{
            "_id":  "_fn",
            "name": "mult3",
            "params": ["num"],
            "code": "(* 3 (maxValsAndMinus3 num))",
            "doc": "This function multiplies (maxValsAndMinus3 num) by 3."
        }],
    "5": [{
        "_id":  "_fn",
        "name": "objectIsAuth?",
        "code": "(== (?auth_id) (?o))",
        "doc": "Checks whether the (proposed) object is equal to auth id performing this transaction."
    }],
    "6": ["Ensure an object is non-negative.",
    "Ensure a string is less", 
    "than 20 characters long.",
    "Ensure an integer only", 
    "increases, or only decreases."],
    "7": [{
        "_id": ["_collection/name", "artist"],
        "spec": ["_fn$artistNameReq"],
        "specDoc": "An artist is required to have a name."
      },
      {
        "_id": "_fn$artistNameReq",
        "name": "artistNameReq",
        "code": "(boolean (get (query (str \"{\\\"select\\\": [\\\"*\\\"], \\\"from\\\":\" (?sid) \"}\")) \"artist/name\"))"
      }],
    "8": ["d[ o_0 ]b", "There's nothing to see here."],
    "9": ["٩(̾●̮̮̃̾•̃̾)۶", "What? You expected to find answers?",
"No answers here."],
    "10": [{
        "_id": ["person/handle", "jdoe"],
        "favNums": ["#(+ 14 5 (?pO))"]
      }],
    "11": "♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪"
}

                    