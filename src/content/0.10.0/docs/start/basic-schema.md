## Basic Schema

We recommend that you read this section using the 'FlureeQL' code examples (select in top left) unless you have specific reason to use a different language. 

This section shows you how to create a simple schema and populate your database with sample data. All of the examples in the Query and Transact sections of the Documentation use the schema located here, so we recommend that you populate a database with this sample data.

If you are using the user interface, you can issue all of the code on this page directly on the 'FlureeQL' page of your user interface. Make sure that you select 'Transact'.

If you are using the API, you can issue all these transactions to endpoints ending with `/transact`. 

### New Database

Make sure that you have a new database. You can either create a new database through the [user interface](/docs/getting-started/user-interface#account-page), through the API for the [downloadable version](/api/downlaoded-endpoints/downloaded-examples#-new-db), or through the API for the [hosted version](/api/hosted-endpoints/hosted-examples#-api-action-new-database). 

### Overview

In Fluree, schema are comprised of collections and predicates. A [collection](/docs/schema/overview#collections) is analogous to a relational database table. Every time you want a new type of item in your database, you would create a new collection. For example, collections in your database might be person, company, and city. 

Every collection has [predicates](/docs/schema/overview#predicates). Predicates are analogous to relational database columns. The features of a collection are its predicates. For example, the person collection might have the following predicates: person/firstName, person/lastName, and person/age. The value of those predicates are called, objects (read more about the [subject-predicate-object model](/docs/infrastructure/db-infrastructure#subject-predicate-object-model)).

Note that many of the transactions in this section can be combined, but are separated for clarity. 

### Adding Collections

In order to add a collection, you need to specify what type of subject you are creating (a `_collection`) and a collection name (there are also additional [collection predicates](/docs/infrastructure/system-collections#_collection) that can be specified). 

The below transaction adds five new collections: `person`, `chat`, `comment`, `artist`, and `movie`. You can issue this transaction in your user interface. 

```flureeql
[{
 "_id": "_collection",
 "name": "person"
},
{
 "_id": "_collection",
 "name": "chat"
},
{
 "_id": "_collection",
 "name": "comment"
},
{
 "_id": "_collection",
 "name": "artist"
},
{
 "_id": "_collection",
 "name": "movie"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
 "_id": "_collection",
 "name": "person"
},
{
 "_id": "_collection",
 "name": "chat"
},
{
 "_id": "_collection",
 "name": "comment"
},
{
 "_id": "_collection",
 "name": "artist"
},
{
 "_id": "_collection",
 "name": "movie"
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

{
  "myCollectionTx": "[{\"_id\":\"_collection\",\"name\":\"person\"},{\"_id\":\"_collection\",\"name\":\"chat\"},{\"_id\":\"_collection\",\"name\":\"comment\"},{\"_id\":\"_collection\",\"name\":\"artist\"},{\"_id\":\"_collection\",\"name\":\"movie\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

### Adding Predicates

Schema predicates are similar to relational database columns, however there are fewer restrictions (any predicate can be attached to any subject, unless a restriction is put in place using a `spec`). 

In order to create a predicate, you only need to specify what type of subject you are creating (`_predicate`), a name, and a type. The name for a predicate should be name-spaced with the relevant collection (as in all predicates in the `person` collection should begin with `person/`).

In the below transaction, we also specify some other information for predicates. You can find all of the [predicate predicates](/docs/infrastructure/system-collections#_predicate) that can be specified in the `System Collections` section. 

The below transaction creates the following predicates: 

- `person/handle`
- `person/fullName`
- `person/follows`
- `person/age`
- `person/favNums`
- `person/favArtists`
- `person/favMovies`
- `person/user`
- `chat/message`
- `chat/person`
- `chat/instant`
- `chat/comments`
- `comment/message`
- `comment/person`
- `artist/name`
- `movie/title`


<pre style="height: 200px;overflow-y: scroll"><code class="language-flureeql">
[{
  "_id":    "_predicate",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_predicate",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id": "_predicate",
  "name": "person/age",
  "doc": "The person's age in years",
  "type": "int",
  "index": true
},
{
  "_id":   "_predicate",
  "name":  "person/follows",
  "doc":   "Any persons this subject follows",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":    "_predicate",
  "name":   "person/favNums",
  "doc":    "The person's favorite numbers",
  "type":   "int",
  "multi":  true
},
{
  "_id":    "_predicate",
  "name":   "person/favArtists",
  "doc":    "The person's favorite artists",
  "type":   "ref",
  "restrictCollection": "artist",
  "multi":  true
},
{
  "_id":    "_predicate",
  "name":   "person/favMovies",
  "doc":    "The person's favorite movies",
  "type":   "ref",
  "restrictCollection": "movie",
  "multi":  true
},
{
  "_id":  "_predicate",
  "name": "person/user",
  "type": "ref",
  "restrictCollection": "_user"
},
{
  "_id":  "_predicate",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_predicate",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_predicate",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_predicate",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_predicate",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_predicate",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id": "_predicate",
  "name": "artist/name",
  "type": "string",
  "unique": true
},
{
  "_id": "_predicate",
  "name": "movie/title",
  "type": "string",
  "unique": true
}]
</code></pre>

<pre style="height: 200px;overflow-y: scroll"><code class="language-curl">
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "_predicate",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_predicate",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id": "_predicate",
  "name": "person/age",
  "doc": "The person's age in years",
  "type": "int",
  "index": true
},
{
  "_id":   "_predicate",
  "name":  "person/follows",
  "doc":   "Any persons this subject follows",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":    "_predicate",
  "name":   "person/favNums",
  "doc":    "The person's favorite numbers",
  "type":   "int",
  "multi":  true
},
{
  "_id":    "_predicate",
  "name":   "person/favArtists",
  "doc":    "The person's favorite artists",
  "type":   "ref",
  "restrictCollection": "artist",
  "multi":  true
},
{
  "_id":    "_predicate",
  "name":   "person/favMovies",
  "doc":    "The person's favorite movies",
  "type":   "ref",
  "restrictCollection": "movie",
  "multi":  true
},
{
  "_id":  "_predicate",
  "name": "person/user",
  "type": "ref",
  "restrictCollection": "_user"
},
{
  "_id":  "_predicate",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_predicate",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_predicate",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_predicate",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_predicate",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_predicate",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id": "_predicate",
  "name": "artist/name",
  "type": "string",
  "unique": true
},
{
  "_id": "_predicate",
  "name": "movie/title",
  "type": "string",
  "unique": true
}]' \
   [HOST]/api/db/transact
</code></pre>


```graphql
mutation addPeoplePredicates ($myPersonTx: JSON) {
  transact(tx: $myPersonTx)
}

mutation addChatPredicates ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

mutation addCommentPredicates ($myCommentTx: JSON) {
  transact(tx: $myCommentTx)
}

mutation addArtistPredicates ($myArtistTx: JSON) {
  transact(tx: $myArtistTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{"myPersonTx": "[{\"_id\":\"_predicate\",\"name\":\"person/handle\",\"doc\":\"The person's unique handle\",\"unique\":true,\"type\":\"string\"},{\"_id\":\"_predicate\",\"name\":\"person/fullName\",\"doc\":\"The person's full name.\",\"type\":\"string\",\"index\":true},{\"_id\":\"_predicate\",\"name\":\"person/age\",\"doc\":\"The person's age in years\",\"type\":\"int\",\"index\":true},{\"_id\":\"_predicate\",\"name\":\"person/follows\",\"doc\":\"Any persons this subject follows\",\"type\":\"ref\",\"restrictCollection\":\"person\"},{\"_id\":\"_predicate\",\"name\":\"person/favNums\",\"doc\":\"The person's favorite numbers\",\"type\":\"int\",\"multi\":true},{\"_id\":\"_predicate\",\"name\":\"person/favArtists\",\"doc\":\"The person's favorite artists\",\"type\":\"ref\",\"restrictCollection\":\"artist\",\"multi\":true},{\"_id\":\"_predicate\",\"name\":\"person/favMovies\",\"doc\":\"The person's favorite movies\",\"type\":\"ref\",\"restrictCollection\":\"movie\",\"multi\":true},{\"_id\":\"_predicate\",\"name\":\"person/user\",\"type\":\"ref\",\"restrictCollection\":\"_user\"},{\"_id\":\"_predicate\",\"name\":\"chat/message\",\"doc\":\"A chat message\",\"type\":\"string\"},{\"_id\":\"_predicate\",\"name\":\"chat/person\",\"doc\":\"A reference to the person that created the message\",\"type\":\"ref\",\"restrictCollection\":\"person\"},{\"_id\":\"_predicate\",\"name\":\"chat/instant\",\"doc\":\"The instant in time when this chat happened.\",\"type\":\"instant\",\"index\":true},{\"_id\":\"_predicate\",\"name\":\"chat/comments\",\"doc\":\"A reference to comments about this message\",\"type\":\"ref\",\"component\":true,\"multi\":true,\"restrictCollection\":\"comment\"},{\"_id\":\"_predicate\",\"name\":\"comment/message\",\"doc\":\"A comment message.\",\"type\":\"string\"},{\"_id\":\"_predicate\",\"name\":\"comment/person\",\"doc\":\"A reference to the person that made the comment\",\"type\":\"ref\",\"restrictCollection\":\"person\"},{\"_id\":\"_predicate\",\"name\":\"artist/name\",\"type\":\"string\",\"unique\":true},{\"_id\":\"_predicate\",\"name\":\"movie/title\",\"type\":\"string\",\"unique\":true}]"
}

```

```sparql
Transactions not supported in SPARQL.
```

### Adding Sample Data

You can issue the below transaction to add some sample data into your database. The below transaction adds four users, three chats, four comments, and three artists. 

<pre style="height: 200px;overflow-y: scroll"><code class="language-flureeql">
[{
  "_id":      "person$jdoe",
  "handle":   "jdoe",
  "fullName": "Jane Doe",
  "age": 25,
  "favNums":  [1223, 12, 98, 0, -2],
  "favArtists": ["artist$1", "artist$2", "artist$3"],
  "follows": "person$zsmith",
  "favMovies": ["movie$1", "movie$2", "movie$3"]
},
{
  "_id":      "person$zsmith",
  "handle":   "zsmith",
  "fullName": "Zach Smith",
  "age": 63,
  "favNums": [5, 645, 28, -1, 1223],
  "favArtists": ["artist$1"],
  "follows": "person$jdoe",
  "favMovies": ["movie$2", "movie$3"]
},
{
  "_id":      "person$anguyen",
  "handle":   "anguyen",
  "fullName": "Amy Nguyen",
  "age": 34,
  "favNums": [7,  98, 0, 2],
  "favArtists": ["artist$2", "artist$3"],
  "follows": "person$jdoe",
  "favMovies": ["movie$3"]
},
{
  "_id":      "person$dsanchez",
  "handle":   "dsanchez",
  "fullName": "Diana Sanchez",
  "age": 70,
  "favNums": [9, 1950],
  "favArtists": ["artist$2"],
  "follows": "person$anguyen",
  "favMovies": ["movie$1", "movie$2", "movie$3"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm chat from Jane.",
  "person":  "person$jdoe",
  "instant": "#(- (now) 20000)",
  "comments": ["comment$zsmith", "comment$anguyen"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm a chat from Diana.",
  "person":  "person$dsanchez",
  "instant": "#(- (now) 5000)",
  "comments": ["comment$zsmithagain", "comment$anguyenagain"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm a chat from Zach.",
  "person":  "person$zsmith",
  "instant": "#(now)"
},
{
  "_id":     "comment$zsmith",
  "message": "Zsmith is responding!",
  "person": "person$zsmith"
},
{
  "_id":     "comment$anguyen",
  "message": "Hi Jane!",
  "person": "person$anguyen"
},
{
    "_id": "comment$zsmithagain",
    "message": "Welcome Diana!",
    "person": "person$zsmith"
},
{
    "_id": "comment$anguyenagain",
    "message": "Welcome Diana! This is Amy.",
    "person": "person$anguyen"
},
{
  "_id": "artist$1",
  "name": "Gustav Klimt"
},
{
  "_id": "artist$2",
  "name": "Augusta Savage"
},
{
  "_id": "artist$3",
  "name": "Jean-Michel Basquiat"
},
{
"_id": "movie$1",
"title": "The Shawshank Redemption"
},
{
"_id": "movie$2",
"title": "Hot Fuzz"
},
{
"_id": "movie$3",
"title": "Gran Torino"
}]
</code>
</pre>

<pre style="height: 200px;overflow-y: scroll"><code class="language-curl">
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person$jdoe",
  "handle":   "jdoe",
  "fullName": "Jane Doe",
  "age": 25,
  "favNums":  [1223, 12, 98, 0, -2],
  "favArtists": ["artist$1", "artist$2", "artist$3"],
  "follows": "person$zsmith",
  "favMovies": ["movie$1", "movie$2", "movie$3"]
},
{
  "_id":      "person$zsmith",
  "handle":   "zsmith",
  "fullName": "Zach Smith",
  "age": 63,
  "favNums": [5, 645, 28, -1, 1223],
  "favArtists": ["artist$1"],
  "follows": "person$jdoe",
  "favMovies": ["movie$2", "movie$3"]
},
{
  "_id":      "person$anguyen",
  "handle":   "anguyen",
  "fullName": "Amy Nguyen",
  "age": 34,
  "favNums": [7,  98, 0, 2],
  "favArtists": ["artist$2", "artist$3"],
  "follows": "person$jdoe",
  "favMovies": ["movie$3"]
},
{
  "_id":      "person$dsanchez",
  "handle":   "dsanchez",
  "fullName": "Diana Sanchez",
  "age": 70,
  "favNums": [9, 1950],
  "favArtists": ["artist$2"],
  "follows": "person$anguyen",
  "favMovies": ["movie$1", "movie$2", "movie$3"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm chat from Jane.",
  "person":  "person$jdoe",
  "instant": "#(- (now) 20000)",
  "comments": ["comment$zsmith", "comment$anguyen"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm a chat from Diana.",
  "person":  "person$dsanchez",
  "instant": "#(- (now) 5000)",
  "comments": ["comment$zsmithagain", "comment$anguyenagain"]
},
{
  "_id":     "chat",
  "message": "Hi! I'm a chat from Zach.",
  "person":  "person$zsmith",
  "instant": "#(now)"
},
{
  "_id":     "comment$zsmith",
  "message": "Zsmith is responding!",
  "person": "person$zsmith"
},
{
  "_id":     "comment$anguyen",
  "message": "Hi Jane!",
  "person": "person$anguyen"
},
{
    "_id": "comment$zsmithagain",
    "message": "Welcome Diana!",
    "person": "person$zsmith"
},
{
    "_id": "comment$anguyenagain",
    "message": "Welcome Diana! This is Amy.",
    "person": "person$anguyen"
},
{
  "_id": "artist$1",
  "name": "Gustav Klimt"
},
{
  "_id": "artist$2",
  "name": "Augusta Savage"
},
{
  "_id": "artist$3",
  "name": "Jean-Michel Basquiat"
},
{
"_id": "movie$1",
"title": "The Shawshank Redemption"
},
{
"_id": "movie$2",
"title": "Hot Fuzz"
},
{
"_id": "movie$3",
"title": "Gran Torino"
}]' \
   [HOST]/api/db/transact  
</code>
</pre>

```graphql
mutation addSampleData ($mySampleDataTx: JSON) {
  transact(tx: $mySampleDataTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "mySampleDataTx": "[{\"_id\":\"person$jdoe\",\"handle\":\"jdoe\",\"fullName\":\"Jane Doe\",\"age\":25,\"favNums\":[1223,12,98,0,-2],\"favArtists\":[\"artist$1\",\"artist$2\",\"artist$3\"],\"follows\":\"person$zsmith\",\"favMovies\":[\"movie$1\",\"movie$2\",\"movie$3\"]},{\"_id\":\"person$zsmith\",\"handle\":\"zsmith\",\"fullName\":\"Zach Smith\",\"age\":63,\"favNums\":[5,645,28,-1,1223],\"favArtists\":[\"artist$1\"],\"follows\":\"person$jdoe\",\"favMovies\":[\"movie$2\",\"movie$3\"]},{\"_id\":\"person$anguyen\",\"handle\":\"anguyen\",\"fullName\":\"Amy Nguyen\",\"age\":34,\"favNums\":[7,98,0,2],\"favArtists\":[\"artist$2\",\"artist$3\"],\"follows\":\"person$jdoe\",\"favMovies\":[\"movie$3\"]},{\"_id\":\"person$dsanchez\",\"handle\":\"dsanchez\",\"fullName\":\"Diana Sanchez\",\"age\":70,\"favNums\":[9,1950],\"favArtists\":[\"artist$2\"],\"follows\":\"person$anguyen\",\"favMovies\":[\"movie$1\",\"movie$2\",\"movie$3\"]},{\"_id\":\"chat\",\"message\":\"Hi! I'm chat from Jane.\",\"person\":\"person$jdoe\",\"instant\":\"#(- (now) 20000)\",\"comments\":[\"comment$zsmith\",\"comment$anguyen\"]},{\"_id\":\"chat\",\"message\":\"Hi! I'm a chat from Diana.\",\"person\":\"person$dsanchez\",\"instant\":\"#(- (now) 5000)\",\"comments\":[\"comment$zsmithagain\",\"comment$anguyenagain\"]},{\"_id\":\"chat\",\"message\":\"Hi! I'm a chat from Zach.\",\"person\":\"person$zsmith\",\"instant\":\"#(now)\"},{\"_id\":\"comment$zsmith\",\"message\":\"Zsmith is responding!\",\"person\":\"person$zsmith\"},{\"_id\":\"comment$anguyen\",\"message\":\"Hi Jane!\",\"person\":\"person$anguyen\"},{\"_id\":\"comment$zsmithagain\",\"message\":\"Welcome Diana!\",\"person\":\"person$zsmith\"},{\"_id\":\"comment$anguyenagain\",\"message\":\"Welcome Diana! This is Amy.\",\"person\":\"person$anguyen\"},{\"_id\":\"artist$1\",\"name\":\"Gustav Klimt\"},{\"_id\":\"artist$2\",\"name\":\"Augusta Savage\"},{\"_id\":\"artist$3\",\"name\":\"Jean-Michel Basquiat\"},{\"_id\":\"movie$1\",\"title\":\"The Shawshank Redemption\"},{\"_id\":\"movie$2\",\"title\":\"Hot Fuzz\"},{\"_id\":\"movie$3\",\"title\":\"Gran Torino\"}]"
}
```
```sparql
Transactions not supported in SPARQL.
```