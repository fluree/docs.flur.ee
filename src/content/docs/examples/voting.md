## Voting

This example outlines how users can vote on proposed changes to the database. At the end of the example, user will be able to propose changes, vote on those changes, and create various voting threshholds (minimum votes and minimum win percentage) for different predicates. There are various ways to enable a rule governance scheme, but this is one simple way.

In our hypothetical example, let's say we've had a network that has been humming along quite smoothly, except that a few rogue users have adopted offensive usernames. Rather than relying on central authority to interpret and enforce community standards, we can create a voting mechanism for whenever a user wants to change their username. In practice, you might want to add rules that prevent users from using certain words in their usernames in the first-place, or initiate a voting process only after a complaint. As previously stated, this is a example is a backbone that can be built upon for real-life applications.

Currently, all the code is written in FlureeQL exclusively. 

### Schema

We will need two additional collections, `vote` and `change` for our example. 

The `vote` collection will have a `vote/name`, `vote/yesVotes`, and `vote/noVotes`. The yes and no votes predicates are multi, ref-type predicates that will hold all of the auth records that voted yes or no, respectively, on the proposed change. 

FlureeQL: 
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
  "_id": "_predicate",
  "name": "vote/name",
  "type": "string",
  "unique": true
 },
  {
  "_id": "_predicate",
  "name": "vote/noVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 },
 {
  "_id": "_predicate",
  "name": "vote/yesVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 }
]
```

The `change` collection holds the actual details for the proposed change. It has the following predicates, `change/name`, `change/subject`, `change/predicate`, `change/doc`, `change/vote`, and `change/object`. 

`change/subject` is a reference to subject on which we are proposing a change. For example, if we had a collection, group, we could propose a change on a particular `group` subject. If we wanted to vote on the leader of that group, `change/predicate` would reference the `group/leader` predicate, and `change/object` would be the proposed value, for instance, `John Doe`. 

FlureeQL
```all
[{
  "_id": "_predicate",
  "name": "change/name",
  "type": "string",
  "index": true,
  "unique": true
 },
 {
  "_id": "_predicate",
  "name": "change/subject",
  "type": "ref",
  "index": true,
  "doc": "A reference to the subject for the proposed change"
 },
 {
  "_id": "_predicate",
  "name": "change/predicate",
  "type": "ref",
  "index": true,
  "restrictCollection": "_predicate",
  "doc": "A reference to the predicate where the change is being proposed"
 },
 {
  "_id": "_predicate",
  "name": "change/doc",
  "doc": "Description of the proposed change",
  "type": "string"
 },
 {
  "_id": "_predicate",
  "name": "change/vote",
  "type": "ref",
  "unique": true
 },
 {
  "_id": "_predicate",
  "name": "change/object",
  "doc": "The proposed new object for the change. Can only be a string",
  "type": "string",
  "index": true
 }
]
```

Subjects in the `change` collection contains all the details about the change that is proposed, as well as a reference to the relevant vote. You'll notice that the object of the proposed change can only be a string. This is to simplify this example, but in a real application, you might want to be able to vote on changes with other types of objects as well. 

### Adding Sample Data

Before doing any additional work on schema, such as adding smart functions and rules, we should add in sample data. We are going to create 5 users, connect those records to 5 new auth records, and connect those auth records to a role, `voter` (which doesn't have any rules connected to it yet!).

FlureeQL:
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
},
{
    "_id": "_auth$1",
    "id": "auth1",
    "doc": "Basic auth records",
    "roles": ["_role$voter"]
},
{
    "_id": "_auth$2",
    "id": "auth2",
    "doc": "Basic auth records",
    "roles": ["_role$voter"]
},
{
    "_id": "_auth$3",
    "id": "auth3",
    "doc": "Basic auth records",
    "roles": ["_role$voter"]
},
{
    "_id": "_auth$4",
    "id": "auth4",
    "doc": "Basic auth records",
    "roles": ["_role$voter"]
},
{
    "_id": "_auth$5",
    "id": "auth5",
    "doc": "Basic auth record",
    "roles": ["_role$voter"]
},
{
    "_id": "_role$voter",
    "id": "voter",
    "doc": "A voter can view and edit changes, votes, and users. They cannot edit, auth records."
}]
```

### Adding Permissions

Before building out our smart functions (`_fn`), we will add permissions to our network. For example, we want to ensure that users can't freely add new auth records, otherwise they'd be able add new auth records and artificially inflate a vote. We do want to make sure that users have access to the `vote` and `change` collections. 

All of the permissions transactions can be added at once, but we break them up here for clarity. 

First, we add four rules that will allow users to transact and view votes and changes. The rules only allow users to view, but not edit, auth records and users. 

FlureeQL:
```all
[{
    "_id": "_rule$editVotes",
    "fns": [["_fn/name", "true"]],
    "id": "editVotes",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$editChanges",
    "fns": [["_fn/name", "true"]],
    "id": "editChanges",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$viewUsers",
    "fns": [["_fn/name", "true"]],
    "id": "viewUsers",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["query"]
},
{
    "_id": "_rule$viewAuth",
    "fns": [["_fn/name", "true"]],
    "id": "viewAuth",
    "collection": "_auth",
    "collectionDefault": true,
    "ops": ["query"]
}]
```


FlureeQL:
```all
[{
    "_id": "_rule$editOwnUser",
    "fns": ["_fn$editOwnUser"],
    "id": "editOwnUser",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["transact"]
},

{
    "_id": "_fn$editOwnUser",
    "name": "editOwnUser",
    "code": "(== (?o) (?user_id))"
}]
```

We've now added all of the rules we need, so we can add those rules to the `voter` role that we created previously: 

FlureeQL:
```all
[{
    "_id": ["_role/id", "voter"],
    "rules": [["_rule/id", "editChanges"], ["_rule/id", "editVotes"], ["_rule/id", "editOwnUser"], 
    ["_rule/id", "viewUsers"],["_rule/id", "viewAuth"]]
}]
```

### Preventing Voter Fraud 

The `vote/yesVotes` and `vote/noVotes` predicates hold all of the auth records that voted for or against a proposed change. We can add a spec to both of these predicates, which ensures that users only cast votes with their own auth records. 

The rule, `(== (?o) (?auth_id))` checks whether the object being added to the vote, `?o`, belongs to the auth record of the user placing the vote.

FlureeQL:
```all
[
    {
        "_id": "_fn$ownAuth",
        "_fn/name": "ownAuth?",
        "_fn/code": "(== (?o) (?auth_id))"
    },
    {
        "_id": ["_predicate/name", "vote/yesVotes"],
        "spec": ["_fn$ownAuth"]
    },
    {
        "_id": ["_predicate/name", "vote/noVotes"],
        "spec": ["_fn$ownAuth"]
    }
]
```

When working this into a real-life application, you may also add a rule that a user can't change their vote after a certain time (by adding a `vote/expiration` predicate), or can only vote yes OR no. For simplicity's sake, we won't be doing this here. 

### Proposing a Change 

Now that we've done our part to prevent voter fraud, we can propose a change. `["_user/username", "softCell"]` wants to change their username to "hardCell", so they propose a change, and create a vote. Soft Cell also adds their auth record to the `vote/yesVotes` predicate, and includes an object in their transaction (with `"_id": "_tx"`) that signs their transaction as them.

FlureeQL:
```all
[{
    "_id": "change",
    "name": "softCellNameChange",
    "doc": "It's time for a change!",
    "subject": ["_user/username", "softCell"],
    "predicate": ["_predicate/name", "_user/username"],
    "object": "hardCell",
    "vote": "vote$softCell"
},
{
    "_id": "vote$softCell",
    "name": "softCellNameVote",
    "yesVotes": [["_auth/id", "auth3"]]
},
{
    "_id": "_tx",
    "auth": ["_auth/id", "auth3"]
}]
```

### Building Our Smart Functions

Currently, there is nothing stopping Soft Cell from issuing a transaction to change their `_user/username` from `softCell` to `hardCell`. In order to prevent users from editing their usernames without a vote, we need to create a set of smart functions ([database functions](#database-functions-1)) that we can add to the `_user/username` predicate specification. 

Given an subject id, we can see all the votes related to that subject with a single query. 

FlureeQL:
```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/subject = 21474837482"
}
```

Note: Currently, two-tuple references to entities, i.e. `["_user/username", "softCell"]`, are not supported in where clauses. In the case of our database, `["_user/username", "softCell"]` resolves to the id `21474837482`. You can find out this information for your own database by querying, `{"select": ["_id"],"from": ["_user/username", "softCell"]}`.

The above query returns *every* change that might have been proposed for `21474837482`, including changes to other predicates, such as Soft Cell's `_user/auth` or their `_user/roles`. It also might return other changes proposed for their `_user/username` other than `hardCell`.

We want to make sure that we are only looking at votes for a given subject that also pertain to the proper predicate and the relevant object. In order to do this, we need to query the following, where `50` is the subject id for the `_user/username` predicate (you can see this in your database with the query: `{"select": ["_id"],"from": ["_predicate/name", "_user/username"]})`.

FlureeQL:
```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/subject = 21474837482 AND change/predicate = 50 AND change/value = \"hardCell\""
}
```

Sample result in FlureeQL:
```all
{
  "status": 200,
  "result": [
    {
      "change/vote": {
        "vote/name": "softCellNameVote",
        "vote/yesVotes": [
          {
            "_id": 25769804775
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

The function, `voteWhere` constructs the where clause using the `str` function, which concatenates all strings in a given array (all available database or smart functions are detailed in [database functions](#database-functions-1)). 

When we are editing a given subject's predicate in a transaction, we have access to the value we are attempting to input `(?o)`, the id of the subject we are editing `(?sid)`, and the id of the predicate we are editing `(?pid)`, which is all of the information we need in order to compose our where clause. 

```
[ 
    {
        "_id": "_fn",
        "name": "voteWhere",
        "code": "(str \"change/subject = \\\"\" (?sid) \"\\\"\"  \" AND change/predicate = \" (?pid) \" AND change/object = \" (?o))"
    }
]
```

One of the most useful features of smart functions is that we can put them together. The second function we create issues a query using the `query` smart function. The arguments or parameters for the `query` function are: `select-string`, `from-string`, `where-string`, `block-string`, `limit-string`.

For `select-string`, we use `[{change/vote [*]}]`. `from-string` is nil. For `where-string`, rather than composing the `where-string` from scratch, we can simply use `(voteWhere)`. `block-string` and `limit-string` are both set to nil.

FlureeQL:
```all
[{
        "_id": "_fn",
        "name": "vote",
        "code": "(query \"[{change/vote [*]}]\" nil (voteWhere) nil nil)"
}]
```

Using the `(vote)` function, we can access the `vote/yesVotes` and `vote/noVotes`. We use the `get-all` function, and we specify path that we want to follow in order to get the `vote/noVotes` and `vote/yesVotes` (`["change/vote", "vote/noVotes"])`. 

If you're uncertain where we got this path from, issue the query: `{ "select": [ { "change/vote": ["*"]}], "where": "change/subject = 21474837482 AND change/predicate = 50 AND change/object = \"hardCell\"" }`.

FlureeQL:
```all
[{
    "_id": "_fn",
    "name": "noVotes",
    "code": "(get-all (vote) [\"change/vote\" \"vote/noVotes\"] )"
},
{
    "_id": "_fn",
    "name": "yesVotes",
    "code": "(get-all (vote) [\"change/vote\" \"vote/yesVotes\"] )"
}]
```

We want to be able to set both a minimum win percentage, as well as a minimum number of votes for each of our votes. For example, we might want to make every vote have at least 10 yes and no vote, combined. In addition, in order for a vote to pass, we could set a minimum threshhold of 50% or 60%. 

First, we create a function, `minWinPercentage` that calculates whether the ratio of yes votes to total votes is above a given percentage. Rather than hard-coding a percentage, we use a `_fn/param`.

FlureeQL:
```all
[{
    "_id": "_fn",
    "name": "minWinPercentage",
    "params": [ "percentage" ],
    "code": "(> (/ (count (yesVotes)) (+ (count (yesVotes)) (count (noVotes)))) percentage)"
}]
```

Then, we create a function, `minVotes`, which checks whether the total number of votes is above a given parameter, `n`. 

FlureeQL:
```all
[{
    "_id": "_fn", 
    "name": "minVotes",
    "params": ["n"],
    "code": "(> (+ (count (yesVotes))  (count (noVotes))))"
}]
```

Finally, we can create a function which checks whether a vote on a given subject, on a given predicate, with the given value passes a certain threshhold of minimum votes and a certain minimum win percentage. In this case, we create a 2 vote minimum with a 0.50 minimum win percentage (note that in our `minWinPercentage` function, we used the `>` sign, which indicates strictly greater than. Therefore, if there are only two votes, one for no and one for yes, this particular vote won't pass. Additionally, the percentage needs to be in decimal form with a leading 0). 

FlureeQL:
```all
[{
    "_id": "_fn",
    "name": "2VotesMajority",
    "code": "(and (minVotes 2) (minWinPercentage 0.5))"
}]
```

### Adding the Username Spec

At this point we can add the function, `2VotesMajority` to the `_predicate/spec` for `_user/username`. Now, every time a transaction contains a `_user/username`, the `2VotesMajority` will run. 

FlureeQL:
```all
[{
    "_id": ["_predicate/name", "_user/username"],
    "spec": [["_fn/name", "2VotesMajority"]]
}]
```

### Testing

The only vote that we have so far is `softCell` voting for their own name change. That means that if we attempt to change Soft Cell's username, it should fail.

FlureeQL:
```all
[{
    "_id": ["_user/username", "softCell"],
    "username": "softCell"
}]
```

Response:
```all
{
  "status": 400,
  "message": " Value hardCell does not conform to spec: (and (minVotes 2) (minWinPercentage 0.5))",
  "error": "db/invalid-tx",
  "time": "40.73ms",
  "fuel-remaining": 99999949452
}
```

We would need at least two more yes votes in order to successfully make this change. 

We can add two more votes for this name change (if we have access to `auth1` and `auth2`).

FlureeQL:
```all
[{
    "_id": ["vote/name", "ahaNameVote"],
    "yesVotes": [["_auth/id", "auth1"]]
},
{
    "_id": "_tx",
    "auth": ["_auth/id", "auth1"]
}]
```

FlureeQL:
```all
[{
    "_id": ["vote/name", "ahaNameVote"],
    "yesVotes": [["_auth/id", "auth2"]]
},
{
    "_id": "_tx",
    "auth": ["_auth/id", "auth2"]
}]
```

After adding more yes votes, the transaction, `[{ "_id": ["_user/username", "softCell"], "username": "hardCell" }]` passes. 

We now have a fully operational voting system. If we want to add a voting requirement to any other predicates, we would simply have to issue a transaction specifying a new function (or re-using `2VotesMajority`), and adding that function to any `_predicate`. The below transction would require at least 10 votes with more than 75% voting yes in order to change smart function code. 

```
[{
    "_id": "_fn$voteReqs",
    "name": "10Votes75%",
    "code": "(and (minVotes 10) (minWinPercentage 0.75))"
},
{
    "_id": ["_predicate/name", "_fn/code"],
    "spec": ["_fn$voteReqs"]
}]

```