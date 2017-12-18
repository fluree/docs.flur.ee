
# Query

## Fluree Queries

Fluree allows you to specify queries using the FlureeQL JSON syntax or with GraphQL. The FlureeQL format, being a JSON data structure, allows for queries to be easily composed within your programming code and is built to support some of Fluree's advanced capabilities like graph recursion. GraphQL supports a more limited set of query capability, but is robust enough for many applications.

Fluree has permissions embedded within the database itself, and with the exception of a `root` priveledged user, a completely custom database is created for every user containing only data they can see. This capability allows more direct access to the database for front-end UIs or other applications, and means much less time spent creating custom API endpoints that simply modify select statements based on who the user is. In fact every data retrival operation for an application can be handled with a single API endpoint.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request, this can be used to reduce round-trips for end-user applications. Both also support query *time travel*.


#### Limit results

```json
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```

#### Time travel by specifying a block number (use block before your chat transaction above)

```json
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```

#### Time travel by specifying a time

```json
{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}
```

## Reference and reverse references

Entities refer (join) to other entities via any attribute that is of type: `ref`.

To refer to another entity, you can utilize any unique identifier for that attribute. This includes the underlying numeric entity `_id` and using any attribute marked as `unique`.

For example, if a person record had an id of `456356774345` and also had a unique attribute of `email`, either could be used as a reference value. Unique attributes need to use an ident type, so something like `["person/email", "me@you.com"]`.

Within queries, references can be traversed in either order. Not the two query examples here. The first finds all chat messages and show the referenced person who posted the message. The second uses a reverse reference (which uses an underscore to signify the reverse relationship). It instead finds all persons, but then shows all of their chat messages.

#### Query for all chat messages, following reference to user that posted message.

```json
{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}
```
#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_`)

```json
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```


