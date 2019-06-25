export default { 
    "1": ["person", "chat", "comment", "artist"],
    "2": [{
        "_id": "_collection$personCollection",
        "name": "person",
        "doc": "Collection to hold all people"
    },
    {
        "_id": "_collection",
        "name": "chat",
        "doc": "Collection to for all chats"
    },
    {
        "_id": "_collection",
        "name": "comment",
        "doc": "Collection to for all comments"
    },
    {
        "_id": "_collection",
        "name": "artist",
        "doc": "Collection to for all artists"
    }],
    "3": [{
        "_id": "_predicate", 
        "name": "chat/message", 
        "type": "string"}],
    "4": [{
        "_id": "_predicate", 
        "name": "person/handle", 
        "type": "string",
        "unique": true},
        {
        "_id": "_predicate", 
        "name": "person/follows", 
         "type": "ref",
         "multi": true,
        "restrictCollection": "person"},
        {
        "_id": "_predicate", 
        "name": "person/favNums", 
        "type": "int",
        "multi": true},
        {
        "_id": "_predicate", 
        "name": "person/favArtists", 
        "type": "ref",
        "multi": true,
        "restrictCollection": "artist"},
        {
            "_id": "_predicate", 
            "name": "chat/person", 
            "type": "ref",
            "restrictCollection": "person"},
        {
        "_id": "_predicate", 
        "name": "chat/instant", 
        "type": "instant"},
        {
            "_id": "_predicate", 
            "name": "chat/comments", 
            "type": "ref",
            "multi": true,
            "restrictCollection": "comment"},
        {
            "_id": "_predicate", 
            "name": "comment/message", 
            "type": "string"},
            {
                "_id": "_predicate", 
                "name": "comment/person", 
                "type": "ref",
                "restrictCollection": "person"},
        {
            "_id": "_predicate",
            "name": "artist/name",
            "type": "string",
            "unique": true
        }],
    "5": [{
        "_id": "person",
        "fullName": "Alton Brown",
        "handle": "aBrown",
        "favNums": [89, 7]
    },
    {
        "_id": "person",
        "fullName": "Oprah Winfrey",
        "handle": "oWinfrey",
        "favNums": [2, 6, 908]
    },
    {
        "_id": "person",
        "fullName": "Roger Goodell",
        "handle": "rGood",
        "favNums": [2]
    }],
    "6": [{
        "_id": "person",
        "fullName": "Connie Suer",
        "handle": "cSuer",
        "favNums": [13],
        "favArtists": ["artist$klimt"]
    },
{
    "_id": "artist$klimt",
    "name": "Gustav Klimt"
}],
    "7": [{
        "_id": "_collection",
        "name": "book"
    },
    {
        "_id": "_predicate",
        "name":"book/title",
        "unique": true,
        "type": "string"
    },
    {
        "_id": "_predicate",
        "name": "book/author",
        "type": "ref",
        "restrictCollection": "person"
    }]
}

                    