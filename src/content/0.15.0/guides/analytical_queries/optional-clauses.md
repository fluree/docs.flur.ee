## Optional Clauses

To write, here I'll discuss common optional "GOTCHAs" and work-arounds, like below. 


```all
{
  "select": [
    {"?person": ["favNums"]},
    "?name",
    "?age",
    "?nums"
  ],
  "where": [
    [
      "?person",
      "person/fullName",
      "?name"
    ],
    {
      "optional": [
        [
          "?person",
          "person/age",
          "?age"
        ],
        [
          "?person",
          "person/favNums",
          "?nums"
        ]
      ]
    },
     {"filter": ["(if (nil? ?nums) true (= 98 ?nums))"]}
  ]
}
```

Currently, we do not support starting your where clause with an `optional` map. This will always return an empty result, as of 0.13.0. 

```flureeql
{
  "select": [ "?person", "?name", "?age" ],
  "where": [ [ "?person", "person/age", "?age"],
    { "optional": [ [ "?person", "person/fullName", "?name"],
        [ "?person", "person/favNums", "?favNums"]]
    }
  ]
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [ "?person", "?name", "?age" ],
  "where": [ [ "?person", "person/age", "?age"],
    { "optional": [ [ "?person", "person/fullName", "?name"],
        [ "?person", "person/favNums", "?favNums"]]
    }
  ]
}' \
   [HOST]/api/db/query
```

```graphql 
Not supported
```

```sparql
SELECT ?person ?name ?age
WHERE {
  ?person fdb:person/fullName ?name. 
  OPTIONAL {  ?person fdb:person/fullName ?name. 
              ?person fdb:person/favNums ?favNums. }
}
```