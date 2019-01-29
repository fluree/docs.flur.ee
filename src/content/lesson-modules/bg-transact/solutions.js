export default { 
    "1": ["a is correct", 
    "b is missing square brackets", 
    "c is missing an `_id`"],

    "2": [{
        "_id": "person",
        "handle": "pGreen",
        "fullName": "Phillip Green",
        "favNums": [7, 2889, 24]           
    }],
    "3": [{
        "_id": "person$kellie",
        "handle": "kOpal",
        "fullName": "Kellie Opal"
    },
    {
        "_id": "chat",
        "message": "Hi everyone! From Kellie",
        "instant": "#(now)",
        "person": "person$kellie"
    }],
    "4": [{
        "_id": "chat",
        "message": "How is everyone?!",
        "person": {
            "_id": "person",
            "handle": "dLopez",
            "fullName": "Denise Lopez"
        }
    }],
    "5": [{
        "_id": "chat", 
        "message": "I'm chatty! I just want to say hi everyone!",
        "person": 9876543
    }],
    "6": { "One Solution": [{
        "_id":      4294967296001,
        "handle": "janieD"
      }], "Another Solution": [{
        "_id":      ["person/handle", "jdoe"],
        "handle": "janieD"
      }]},
    "7": [{
        "_id": 12345,
        "_action":  "delete"
      }],
    "8": [{
        "_id":      ["person/handle", "dLopez"],
        "favNums":   [34],
        "_action":   "delete"
      }],
    "9": ["٩(̾●̮̮̃̾•̃̾)۶", "No challenge here!"]
}
