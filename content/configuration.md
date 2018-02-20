# Applications

## Configuration

An application deployed on Fluree is defined by a single configuration file, commonly named `fluree.json`.  This file defines the database schema, the API endpoints the application responds to, and the applications this application depends on.

The following sections will take you through the top-level keys of the `fluree.json` format.

#### Example fluree.json

```json
{
  "organization": "fluree",
  "application": "example",
  "version": "1",

  "doc": "An example of building a microservice on Fluree",
  "url": "https://flur.ee",

  "route": {
    "path": "/example"
  },

  "dependencies": [{
    "id": "fluree.email",
    "version": "1",
    "tag": "release"
  }],

  "install": [],

  "action": {
    "echo": {
      "doc": "Echoes back what you send it",
      "input": "string",
      "output": "string"
    }
  },

  "schema": {
    "post": {
      "doc": "Forum post",
      "event": {
        "text": {
          "doc": "Content of forum post",
          "required": true,
          "type": "string"
        }
      }
    }
  }
}
```

### Metadata

These top-level keys allow other application developers inside and outside your organization to quickly locate and install your application on an instance.

Key | Description
---|---
`organization` | (required) Allows applications to be namespaced so that, for example, two applications named "email" can coexist in a single Fluree registry.
`application` | (required) Name of the application
`version` | (required) Version string in semver format (e.g. 1, 1.0, 1.0.0, 1.0.0-beta). <br>Breaking changes should alter the first number (i.e. 1.0.1 -> 2.0.0).
`doc` | (optional) Documentation string
`url` | (optional) URL pointing to additional information

#### Example metadata

```json
{
  "organization": "fluree",
  "application": "example",
  "version": "1",

  "doc": "An example of building a microservice on Fluree",
  "url": "https://flur.ee"
}
```

### Routes

If your application serves up static content (i.e. HTML, CSS, images, etc.), that content will be available at a subdirectory on any instance it's installed on.  The CNAME is used to specify the instance, while the value of the `route` key is used to define the subdirectory.

In this example, any request beginning with `https://{instance}.flur.ee/an-example-route` will be routed to your application's Docker container.  Requests will be allowed from any client and do not need to contain an authentication token.

#### Sample route

```json
{
  "route": {"path": "/an-example-route"}
}
```

#### Instance endpoint

```endpoint
GET https://${INSTANCE}.flur.ee/an-example-route/path/to/content
```

### Actions

API actions, which require authentication via a JWT token to invoke, are listed under the `action` key in `fluree.json`.

#### Sample action definition

```json
{
  "organization": "fluree",
  "application": "example",

  "action": [{
    "echo": {
      "doc": "Echos back what you send it",
      "input": "string",
      "output": "string"
    }
  }]
}
```

#### Example invoke

```curl
$ curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FLUREE_TOKEN" -d '{"key": "value"}' "https://$FLUREE_ACCOUNT.flur.ee/api/fluree/example/echo"
```

```javascript
fetch(`https://${instance}.flur.ee/api/fluree/example/echo`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({"key": "value"})
});
```

When your action is invoked, it will be passed two headers containing JWTs that specify the instance and permissions of the user invoking your action.

Header | Value | Description
---|---|---
`Authorization` | `Bearer {jwt}` | This is the JWT access token of the user invoking the action.<br>  You can use this header to call additional services on the user's behalf.
`X-App-Token` | `{jwt}` | This token is for the same instance, but has all the permissions this application has been granted.<br> If you need to perform privileged actions on behalf of the user, use this token in subsequent calls to Fluree.

Both tokens are in the standard JWT format with the following fields.  In most cases, your application will not need to parse these tokens and will treat them as opaque strings.

Field | Description
--- | ---
`aud` | (required) The name of the instance this token is for.
`exp` | (optional) Expiration time in seconds since January 1, 1970 GMT.
`sub` | (optional) String identifier of user.
`jti` | (optional) Unique identifier of JWT. Used for revocation purposes.
`admin` | (optional) True if token grants unrestricted (administrator) access to this instance.

You __do not__ need to verify any of the tokens passed to your application. The Fluree platform contains an API gateway which parses and verifies the tokens before invoking your action. Also, your application generally will not have access to the secret key used to sign the tokens and so will be unable to verify their authenticity.  Contact Fluree if your application needs to generate or verify tokens.


### Schema

Database tables are defined under the `schema` key.  This allows Fluree to create your tables on any datastorage backend (SQL or not) and allows us to build permissions rules and automatic schema checking into the platform.  Furthermore, it serves to document your application's schema to other application writers.

The top-level keys under `schema` are the names of your application's tables.  The event (a.k.a. column or attribute) definitions are under the `event` key.

Event definitions can contain the following fields

Field | Description
---|---
`doc` | (optional) Doc string for this event
`type` | (required) Datatype of this event. See table below for valid data types.  If the type is multi-cardinality, use an array around the base type (e.g. ["integer"]).
`required` | (optional) True if this event is required. (Default false.)
`unique` | (optional) True if this event acts as a primary key.  Inserts into this table with the same primary key as an existing entity become "upserts"; they update the existing entity.  (Default false.)
`index` | (optional) True if an index should be created on this event. (Default false.)
`default` | (optional) Default value.
`history` | (optional) True if we should keep history of this event. (Default true for graph database.  Other databases may not have a concept of history.)
`component` | (optional) True if this event is a reference to another table and when this entity is deleted, the referenced entity should also be deleted. (Default false.)
`deprecated` | (optional) True if this event is deprecated.  Reads and writes are still allowed, but might give warnings in the API.

The event types can be as follows:

Type | Description
---|---
`string` | Unicode string
`integer` | 64 bit signed integer
`float` | 64 bit IEEE double precision floating point
`instant` | Millisecond precision timestamp with time zone
`boolean` | True/false
`uri` | URI formatted string
`bytes` | Byte array
`json` | Arbitrary JSON blob

Relational references to other tables are simply named by the table name.  Note that multi-cardinality types (whether primitive types or relations) do not specify a join table.  The joins are traversed transparently to the user.  In addition, most database storages allow of easy traversal of relations in both the forward and backward directions.  Details are in the query section.

#### Sample schema

```json
{
  "schema": {
    "post": {
      "doc": "Forum post",
      "event": {
        "text": {
          "doc": "Content of forum post",
          "required": true,
          "type": "string"
        },
        "upvotes": {
          "doc": "Number of upvotes this post has received",
          "default": 0,
          "type": "integer",
          "history": false
        },
        "comments": {
          "doc": "Reference to the comments on this post",
          "type": ["comment"],
          "component": true
        }
      }
    },
    "comment": {
      "doc": "Comment on forum post",
      "event": {
        "text": {
          "doc": "Comment text",
          "required": true,
          "type": "string"
        },
        "commenter": {
          "doc": "User who commented on the post",
          "type": "user"
        }
      }
    }
  }
}
```

#### Example query using the sample schema

```curl
$ cat << EOF > query.json
{
  "myQuery": {
    "graph": {
      "allPosts": [
        "post",
        [
          "text",
          "upvotes",
          [
            "comments",
            [
              "text",
              [
                "commenter",
                [
                  "username"
                ]
              ]
            ]
          ]
        ]
      ]
    }
  }
}
EOF

$ curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FLUREE_TOKEN" -d @query.json "https://$FLUREE_ACCOUNT.flur.ee/api/fql"
```

```javascript
var query = {
  "myQuery": [
    "graph",
    {
      "allPosts": [
        "post",
        [
          "text",
          "upvotes",
          [
            "comments",
            [
              "text",
              [
                "commenter",
                [
                  "username"
                ]
              ]
            ]
          ]
        ]
      ]
    }
  ]
};

fetch(`https://${instance}.flur.ee/api/fql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(query);
})
```

#### Example response using the sample schema

```json
{
  "graph": {
    "allPosts": [{
      "_id": "F123",
      "text": "This is a post",
      "upvotes": 1,
      "comments": [{
        "_id": "F456",
        "text": "This is the first comment",
        "commenter": {
          "_id": "F1011",
          "username": "Alice"
        }
      }, {
        "_id": "F789",
        "text": "This is the second comment",
        "commenter": {
          "_id": "F1213",
          "username": "Bob"
        }
      }]
    }]
  }
}
```
