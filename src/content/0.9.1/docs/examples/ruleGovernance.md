
### Rule Governance

This example outlines how users can vote on proposed changes to the ledger. At the end of the example, user will be able to propose changes, vote on those changes, and create various voting threshholds (minimum votes and minimum win percentage) for different attributes. There are various ways to enable a rule governance scheme, but this is one simple way.

In our hypothetical example, let's say we've had a network that has been humming along quite smoothly, except that a few rogue users have adopted offensive usernames. Rather than relying on central authority to interpret and enforce community standards, we can create a voting mechanism for whenever a user wants to change their username. In practice, you might want to add rules that prevent users from using certain words in their usernames in the first-place, or initiate a voting process only after a complaint. As previously stated, this is a example is a backbone that can be built upon for real-life applications.

### Schema

We will need two additional collections, `vote` and `change` for our example. 

The `vote` collection will have a `vote/name`, `vote/yesVotes`, and `vote/noVotes`. The yes and no votes attributes are multi, ref-type attributes that will hold all of the auth records that voted yes or no, respectively, on the proposed change. 

```all
[
 {
  "_id": "_collection",
  "name": "vote"
 },
 {
  "_id": "_collection",
  "name": "change"
 },
 {
  "_id": "_attribute",
  "name": "vote/name",
  "type": "string",
  "unique": true
 },
  {
  "_id": "_attribute",
  "name": "vote/noVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 },
 {
  "_id": "_attribute",
  "name": "vote/yesVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 }
]
```

The `change` collection holds the actual details for the proposed change. It has the following attributes, `change/name`, `change/entity`, `change/attribute`, `change/doc`, `change/vote`, and `change/value`. 

`change/entity` is a reference to entity on which we are proposing a change. For example, if we had a collection, group, we could propose a change on a particular `group` entity. If we wanted to vote on the leader of that group, `change/attribute` would reference the `group/leader` attribute, and `change/value` would be the proposed value, for instance, `John Doe`. 

```all
[{
  "_id": "_attribute",
  "name": "change/name",
  "type": "string",
  "index": true,
  "unique": true
 },
 {
  "_id": "_attribute",
  "name": "change/entity",
  "type": "ref",
  "index": true,
  "doc": "A reference to the entity for the proposed change"
 },
 {
  "_id": "_attribute",
  "name": "change/attribute",
  "type": "ref",
  "index": true,
  "restrictCollection": "_attribute",
  "doc": "A reference to the attribute where the change is being proposed"
 },
 {
  "_id": "_attribute",
  "name": "change/doc",
  "doc": "Description of the proposed change",
  "type": "string"
 },
 {
  "_id": "_attribute",
  "name": "change/vote",
  "type": "ref",
  "unique": true
 },
 {
  "_id": "_attribute",
  "name": "change/value",
  "doc": "The proposed new value for",
  "type": "string",
  "index": true
 }
]
```

### Preventing Vote Fraud 

The `vote/yesVotes` and `vote/noVotes` attributes hold all of the auth records that voted for or against a proposed change. We can add a spec to both of these attributes, which ensures that users only cast votes with their own auth records. 

The rule, `(or [(== [0 (?auth_id)]) (== [(?v) (?auth_id)]) ])` checks whether the value being added to the vote, `?v`, belongs to the auth record of the user placing the vote. Alternatively, if transacting via the root user (where auth_id = 0), you can add as many votes as you like. 

```all
[
    {
        "_id": "_fn$ownAuth",
        "_fn/name": "ownAuth?",
        "_fn/code": "(or [(== [0 (?auth_id)]) (== [(?v) (?auth_id)]) ])"
    },
    {
        "_id": ["_attribute/name", "vote/yesVotes"],
        "spec": ["_fn$ownAuth"]
    },
    {
        "_id": ["_attribute/name", "vote/noVotes"],
        "spec": ["_fn$ownAuth"]
    }
]
```

When working this into a real-life application, you may also add a rule that a user can't change their vote after a certain time (by adding a `vote/expiration` attribute), or can only vote yes OR no.

### Adding Permissions

Before building out our smart functions (`_fn`) any further, we will add permissions to our network. For example, we want to ensure that users can't freely add new auth records, otherwise they'd be able add new auth records and artificially inflate a vote. We do want to make sure that users have access to the `vote` and `change` collections. 

All of the permissions transactions can be added at once, but we break them up here for clarity. 
First, we add four rules that will allow users to transact and view votes, changes, and users. The rules only allow users to view, but not edit, auth records. 

```all
[{
    "_id": "_rule$editVotes",
    "predicate": [["_fn/name", "true"]],
    "id": "editVotes",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$editChanges",
    "predicate": [["_fn/name", "true"]],
    "id": "editChanges",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$editOwnUser",
    "predicate": ["_fn$editOwnUser"],
    "id": "editOwnUser",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["transact"]
},
{
    "_id": "_rule$viewUsers",
    "predicate": [["_fn/name", "true"]],
    "id": "viewUsers",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["query"]
},
{
    "_id": "_rule$viewAuth",
    "predicate": [["_fn/name", "true"]],
    "id": "viewAuth",
    "collection": "_auth",
    "collectionDefault": true,
    "ops": ["query"]
},
{
    "_id": "_fn$editOwnUser",
    "name": "editOwnUser",
    "code": "(== [(?v) (?user_id)])"
}]
```

Next, we group all of the rules we just created into a role, `voter`.  

```all
[{
    "_id": "_role$voter",
    "id": "voter",
    "doc": "A voter can view and edit changes, votes, and users. They can view, but not edit, auth records.",
    "rules": [["_rule/id", "editChanges"], ["_rule/id", "editVotes"], ["_rule/id", "editOwnUser"], 
    ["_rule/id", "viewUsers"],["_rule/id", "viewAuth"]]
}]
```

Now we can create and assign 15 auth records, which all have the voter role. The auth record transactions are very similar for each auth record, so we only show five examples below. 

```all
[{
    "_id": "_auth$1",
    "id": "auth1",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$2",
    "id": "auth2",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$3",
    "id": "auth3",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$4",
    "id": "auth4",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$5",
    "id": "auth5",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
}]
```

To finish off our permissions regime, we add 15 users and assign each of those users an auth record. Although users are not necessary for issuing transactions (only auth records are required), we are building users into this example, because it is a common feature of applications. 

Each of the user transactions is very similar, so we only show five examples. In our example, all of our users are artists who produced one hit wonder. If you would like to follow our lead, then your last 10 users would be: bahaMen, vanillaIce, a-ha, gerardo, debbyBoone, sirMix-A-Lot, vanMcCoy, deee-Lite, ?&TheMysterians. Of course, this is not a technical requirement, but you do get bonus points (non-redeemable) if you can name the songs they are known for. 

```all
[{
    "_id": "_user$1",
    "username": "losDelRio",
    "auth": ["_auth$1"]
},
{
    "_id": "_user$2",
    "username": "softCell",
    "auth": ["_auth$2"]
},
{
    "_id": "_user$3",
    "username": "dexysMidnightRunners",
    "auth": ["_auth$3"]
},
{
    "_id": "_user$4",
    "username": "rightSaidFred",
    "auth": ["_auth$4"]
},
{
    "_id": "_user$5",
    "username": "toniBasil",
    "auth": ["_auth$5"]
}]
```

### Proposing a Change 

Now that we've done our part to prevent voter fraud, we can propose a change. `["_user/username", "a-ha"]` wants to change their username to "Eureka!", so they propose a change, and create a vote. A-Ha also adds their auth record to the `vote/yesVotes` attribute.

```all
[{
    "_id": "change",
    "name": "ahaNameChange",
    "doc": "It's time for a change!",
    "entity": ["_user/username", "a-ha"],
    "attribute": ["_attribute/name", "_user/username"],
    "value": "Eureka!",
    "vote": "vote$aha"
},
{
    "_id": "vote$aha",
    "name": "ahaNameVote",
    "yesVotes": [["_auth/id", "auth8"]]
}]
```

### Building Our Smart Functions

Currently, there is nothing stopping A-Ha from issuing a transaction to change their `_user/username` from `a-ha` to `Eureka!`. In order to prevent users from editing their usernames without a vote, we need to create a set of smart functions ([ledger functions](#ledger-functions-1)) that we can add to the `_user/username` attribute specification. 

Given an entity id, we can see all the votes related to that entity with a single query. 

```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/entity = 21474837487"
}

```

Note: Currently, two-tuple references to entities, i.e. `["_user/username", "a-ha"]`, are not supported in where clauses. In the case of our ledger, `["_user/username", "a-ha"]` resolves to the id `21474837487`. You can find out this information for your own ledger by querying, `{"select": ["_id"],"from": ["_user/username", "a-ha"]}`.

The above query returns *every* change that might have been proposed for `21474837487`, including changes to other attributes, such as A-Ha's `_user/auth` or their `_user/roles`. It also might return other changes proposed for their `_user/username` other than `Eureka!`.


We want to make sure that we are only looking at votes for a given entity that also pertain to the proper attribute and the relevant value. In order to do this, we need to query the following, where `50` is the entity id for the `_user/username` attribute (you can see this in your ledger with the query: `{"select": ["_id"],"from": ["_attribute/name", "_user/username"]})`.

```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/entity = 21474837487 AND change/attribute = 50 AND change/value = \"Eureka!\""
}

```

Sample result:

```all
{
  "status": 200,
  "result": [
    {
      "change/vote": {
        "vote/name": "ahaNameVote",
        "vote/yesVotes": [
          {
            "_id": 25769804783
          }
        ],
        "_id": 4294967296001
      }
    }
  ],
  "fuel": 8,
  "block": 11,
  "time": "3.18ms",
  "fuel-remaining": 99999962775
}
```

The first two functions we create build and issue the above query. We will then use these functions to count votes, and eventually decide whether or not changes should be approved. If, at this point, you cannot understand how these functions fit into the larger applications, do not worry, we will see the entire voting mechanism working in short order. At this point, the most important part is to try and understand the syntax of the individual smart functions.

The function, `?voteWhere` constructs the where clause using the `str` function, which concatenates all strings in a given array (all available ledger or smart functions are detailed in [ledger functions](#ledger-functions-1)). 

When we are editing a given entity's attribute in a transaction, we have access to the value we are attempting to input `(?v)`, the id of the entity we are editing `(?eid)`, and the id of the attribute we are editing `(?aid)`, which is all of the information we need in order to compose our where clause. 

```all
[ 
    {
        "_id": "_fn",
        "name": "?voteWhere",
        "code": "(str [\"change/value = \\\"\" (?v) \"\\\"\"  \" AND change/entity = \" (?eid) \" AND change/attribute = \" (?aid)])"
    }
]
```

One of the most useful features of smart functions is that we can put them together. The second function we create issues a query using the `query` smart function. The arguments or parameters for the `query` function are: `select-string`, `from-string`, `where-string`, `block-string`, `limit-string`.

For `select-string`, we use `[{change/vote [*]}]`. `from-string` is nil. For `where-string`, rather than composing the `where-string` from scratch, we can simply use `(?voteWhere)`. `block-string` and `limit-string` are both set to nil.

```all
[
    {
        "_id": "_fn",
        "name": "?vote",
        "code": "(query \"[{change/vote [*]}]\" nil (?voteWhere) nil nil)"
    }
]
```

Using the `(?vote)` function, we can access the `vote/yesVotes` and `vote/noVotes`. We use the `get-all` function, and we specify path that we want to follow in order to get the `vote/noVotes` and `vote/yesVotes` (`["change/vote", "vote/noVotes"])`. 

If you're uncertain where we got this path from, issue the query: `{ "select": [ { "change/vote": ["*"]}], "where": "change/entity = 21474837487 AND change/attribute = 50 AND change/value = \"Eureka!\"" }`.

```all
[
    {
        "_id": "_fn",
        "name": "noVotes",
        "code": "(get-all (?vote) [\"change/vote\" \"vote/noVotes\"] )"
    },
    {
        "_id": "_fn",
        "name": "yesVotes",
        "code": "(get-all (?vote) [\"change/vote\" \"vote/yesVotes\"] )"
    }
]
```

We want to be able to set both a minimum win percentage, as well as a minimum number of votes for each of our votes. For example, we might want to make every vote have at least 10 yes and no vote, combined. In addition, in order for a vote to pass, we could set a minimum threshhold of 50% or 60%. 

First, we create a function, `minWinPercentage` that calculates whether the ratio of yes votes to total votes is above a given percentage. Rather than hard-coding a percentage, we use a `_fn/param`.

```all
[
    {
        "_id": "_fn",
        "name": "minWinPercentage",
        "params": [ "percentage" ],
        "code": "(> [ ( / [ (count (yesVotes) ) (+ [ (count (yesVotes) )  (count (noVotes) )  ]) ] ) percentage ])"
    }
]
```

Then, we create a function, `minVotes`, which checks whether the total number of votes is above a given parameter, `n`. 

```all
[
    {
        "_id": "_fn", 
        "name": "minVotes",
        "params": ["n"],
        "code": "(> [(+ [ (count (yesVotes) )  (count (noVotes) ) ] )  n ])"
    }
]
```

Finally, we can create a function which checks whether a vote on a given entity, on a given attribute, with the given value passes a certain threshhold of minimum votes and a certain minimum win percentage. In this case, we create a 2 vote minimum with a 0.50 minimum win percentage (note that in our `minWinPercentage` function, we used the `>` sign, which indicates strictly greater than. Therefore, if there are only two votes, one for no and one for yes, this particular vote won't pass. Additionally, the percentage needs to be in decimal form with a leading 0). 

```all
[{
    "_id": "_fn",
    "name": "2VotesMajority",
    "code": "(and [(minVotes 2) (minWinPercentage 0.5)])"
}]
```

### Adding the Username Spec

At this point we can add the function, `2VotesMajority` to the `_attribute/spec` for `_user/username`. Now, every time a transaction contains a `_user/username`, the `2VotesMajority` will run. 

```all
[{
    "_id": ["_attribute/name", "_user/username"],
    "spec": [["_fn/name", "2VotesMajority"]]
}]
```

### Testing

The only vote that we have so far is `a-ha` voting for their own name change. That means that if we attempt to change A-Ha's username, it should fail.

```all
[{
    "_id": ["_user/username", "a-ha"],
    "username": "Eureka!"
}]
```

Response:

```all
{
  "status": 400,
  "message": " Value Eureka! does not conform to spec: (and [(minVotes 2) (minWinPercentage 0.5)])",
  "error": "db/invalid-tx",
  "time": "40.73ms",
  "fuel-remaining": 99999949452
}
```

We would need at least two more yes votes in order to successfully make this change. 

For the purposes of this tutorial, we allow the root user (auth id = 0) to edit `vote/yesVotes` and `vote/noVotes` freely. However, in a real-world application, you may choose to remove this backdoor. Feel free to play around with adding and removing votes using each individual auth. For the purposes of this demonstration, we will add votes via the backdoor (bypassing the `editOwnAuth` rule).

```all
[{
    "_id": ["vote/name", "ahaNameVote"],
    "yesVotes": [["_auth/id", "auth1"], ["_auth/id", "auth2"]]
}]
```

After adding more yes votes, the transaction, `[{ "_id": ["_user/username", "a-ha"], "username": "Eureka!" }]` passes. 

We now have a fully operational voting system. If we want to add a voting requirement to any other attributes, we would simply have to issue a transaction specifying a new function (or re-using `2VotesMajority`), and adding that function to any `_attribute`. The below transaction would require at least 10 votes with more than 75% voting yes in order to change smart function code. 

```all
[{
    "_id": "_fn$voteReqs",
    "name": "10Votes75%",
    "code": "(and [(minVotes 10) (minWinPercentage 0.75)])"
},
{
    "_id": ["_attribute/name", "_fn/code"],
    "spec": ["_fn$voteReqs"]
}]

```