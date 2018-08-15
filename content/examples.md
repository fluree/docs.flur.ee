# Examples

## Cryptocurrency

This example outlines how a user can create a simple cryptocurrency using FlureeDB. The user will be able to check their own balance and add to other users' balances. 

### Schema

The first step is to create a `crypto` collection with the attributes `crypto/balance`, which tracks the amount of currency each user has, `crypto/user`, which references a database `_user`, and `crypto/walletName`, which is a unique name for the entity. 

```
[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]
```

#### Cryptocurrency Schema

```json
[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation cryptoSchema ($mycryptoSchemaTx: JSON) {
  transact(tx: $mycryptoSchemaTx)
}

{
  "mycryptoSchemaTx": "[
      {\"_id\":\"_collection\",\"name\":\"crypto\"},{\"_id\":\"_attribute\",\"name\":\"crypto/balance\",\"type\":\"int\"},{\"_id\":\"_attribute\",\"name\":\"crypto/user\",\"type\":\"ref\",\"restrictCollection\":\"_user\"},
      {\"_id\":\"_attribute\",\"name\":\"crypto/walletName\",\"type\":\"string\",\"unique\":true}]"
}
```


### Ensure Balance Non-Negative

Next, we add an `_attribute/spec` that makes sure our `crypto/balance` is never negative. The code for this is `(< [-1 (?v)])`. To see how to properly format database functions, you can visit [Function Syntax](#function-syntax).

Note, this transaction, and many of the subsequent transactions can be combined. We separate out these transactions here for demonstration purposes. 

```
[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]

```

#### Ensure Balance Non-Negative

```json
[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation nonNegativeBalance ($nonNegativeBalanceTx: JSON) {
  transact(tx: $nonNegativeBalanceTx)
}

{
  "nonNegativeBalanceTx": "[
      {\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"spec\":[\"_fn$nonNegative?\"],\"specDoc\":\"Balance cannot be negative.\"},{\"_id\":\"_fn$nonNegative?\",\"name\":\"nonNegative?\",\"code\":\"(< [-1 (?v)])\"}]"
}
```

### Users and Permissions

In preparation for creating users, we create three functions. The first function checks whether the current entity's `crypto/user` is the same as the user. The second function always returns true, while the third always returns false. We will use this second function to govern whether a given user can transact on a given `crypto/balance` (always true), and the third function to govern whether a given user can transact on a given `crypto/user` (always false).

```
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
},
{
    "_id": "_fn$alwaysTrue",
    "name": "true",
    "code": true
},
{
    "_id": "_fn$alwaysFalse",
    "name": "false",
    "code": false
}]
```

Next, we create two users with `_user/username` cryptoMan and cryptoWoman, as well as two auth records- one for each user. Both auth records are given the `_role`, cryptoUser. A cryptoUser can query their `crypto`, and `transact` on any `crypto/balance`. No one, other than the root user can transact on `crypto/user`.


```
[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]
```

#### Creating Database Functions

```json
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
},
{
    "_id": "_fn$alwaysTrue",
    "name": "true",
    "code": true
},
{
    "_id": "_fn$alwaysFalse",
    "name": "false",
    "code": false
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
},
{
    "_id": "_fn$alwaysTrue",
    "name": "true",
    "code": true
},
{
    "_id": "_fn$alwaysFalse",
    "name": "false",
    "code": false
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation nonNegativeBalance ($dbFunTx: JSON) {
  transact(tx: $dbFunTx)
}

{
  "dbFunTx": "[{\"_id\":\"_fn$ownCrypto\",\"name\":\"ownCrypto?\",\"code\":\"(contains? (get-all (?e) [\\\"crypto/user\\\" \\\"_id\\\"]) (?user_id))\"},{\"_id\":\"_fn$alwaysTrue\",\"name\":\"true\",\"code\":true},{\"_id\":\"_fn$alwaysFalse\",\"name\":\"false\",\"code\":false}]"
}
```

#### Adding Users and Permissions

```json
[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto?"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addUsersPerm ($userPermTx: JSON) {
  transact(tx: $userPermTx)
}

{
  "userPermTx": "[{\"_id\":\"_user$cryptoMan\",\"username\":\"cryptoMan\",\"auth\":[\"_auth$cryptoMan\"]},{\"_id\":\"_user$cryptoWoman\",\"username\":\"cryptoWoman\",\"auth\":[\"_auth$cryptoWoman\"]},{\"_id\":\"_auth$cryptoWoman\",\"id\":\"cryptoWoman\",\"doc\":\"cryptoWoman auth record\",\"roles\":[\"_role$cryptoUser\"]},{\"_id\":\"_auth$cryptoMan\",\"id\":\"cryptoMan\",\"doc\":\"cryptoMan auth record\",\"roles\":[\"_role$cryptoUser\"]},{\"_id\":\"_role$cryptoUser\",\"id\":\"cryptoUser\",\"doc\":\"Standard crypto user\",\"rules\":[\"_rule$viewOwnCrypto\",\"_rule$editAnyCryptoBalance\",\"_rule$cantEditCryptoUser\"]},{\"_id\":\"_rule$editAnyCryptoBalance\",\"id\":\"editAnyCryptoBalance\",\"doc\":\"Any cryptoUser can edit any crypto/balance.\",\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"transact\"],\"collection\":\"crypto\",\"attributes\":[\"crypto/balance\"]},{\"_id\":\"_rule$viewOwnCrypto\",\"id\":\"viewOwnCrypto\",\"doc\":\"A cryptoUser can only view their own balance\",\"predicate\":[[\"_fn/name\",\"ownCrypto\"]],\"ops\":[\"query\"],\"collection\":\"crypto\",\"collectionDefault\":true},{\"_id\":\"_rule$cantEditCryptoUser\",\"id\":\"cantEditCryptoUser\",\"doc\":\"No one, other than root, should ever be able to edit a crypto/user\",\"ops\":[\"transact\"],\"collection\":\"crypto\",\"attributes\":[\"crypto/user\"],\"predicate\":[[\"_fn/name\",\"false\"]],\"errorMessage\":\"You cannot change a crypto/user. \"}]"
}
```

### Adding Crypto/Balance

Once we create these two users, we can give each user a crypto/balance. Note, if you will want more than 400 `crypto/balance` in your database, you will need to add additional users and additional `crypto/balance` at this point in the example. Once we put additional rules in place, no user will be able create `crypto/balance` from nothing without changing the rules that govern the database. 

```
[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]
```

The result is:
```
{
  "tempids": {
    "crypto$1": 4294967296001,
    "crypto$2": 4294967296002
  },
  "block": 6,
  "hash": "4a9199ca984e2a527cb14e6fa7195a2c8d474457f6b56f3b2c2ca14cf054d14a",
  "time": "24.21ms",
  "status": 200,
  "block-bytes": 521,
  "timestamp": 1534360770411,
  "flakes": [
     [ 4294967296002, 1000, 200, -393216, true, 0 ],
     [ 4294967296002, 1001, 21474837480, -393216, true, 0 ],
     [ 4294967296002, 1002, "cryptoMan's Wallet", -393216, true, 0 ],
     [ 4294967296001, 1000, 200, -393216, true, 0 ],
     [ 4294967296001, 1001, 21474837481, -393216, true, 0 ],
     [ 4294967296001, 1002, "cryptoWoman's Wallet", -393216, true, 0 ],
     [ -393216, 1, "4a9199ca984e2a527cb14e6fa7195a2c8d474457f6b56f3b2c2ca14cf054d14a", -393216, true, 0 ],
     [ -393216, 2, "64b73ec0785f16511c4176fb20e4cbcfa9a8a704e62507d3d160dc254686fb96", -393216, true, 0 ],
     [ -393216, 5, 1534360770411, -393216, true, 0 ]
  ]
}
```

#### Adding Crypto/Balance


```json
[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation createCrypto ($createCryptoTx: JSON) {
  transact(tx: $createCryptoTx)
}

{
  "createCryptoTx": "[{\"_id\":\"crypto\",\"walletName\":\"cryptoWoman's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoWoman\"]},{\"_id\":\"crypto\",\"walletName\":\"cryptoMan's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoMan\"]}]"
}
```


### Restrict Crypto Spending

At this point, we have a fairly useless cryptocurrency. Anyone can transact anyone else's `crypto/balance`, and there are no protections against someone transacting your `crypto/balance` to 0. In order to prevent this, we can create a rule that only allows you to withdraw from your own `crypto/balance` or deposit in another user's `crypto/balance`.

The `_fn/code` we use for this is fairly long, so we will break it down together:

```
(or [
        ;; You are the root user
        (== [0 (?auth_id)])  

        ;; If you are not the root user           
        (if-else 
        
            ;; Are you transacting your own crypto?
            (contains? 
                (get-all (?e) [\"crypto/user\" \"_id\"]) 
                (?user_id)
            )  

            ;; Yes? New value (?v) must be less than previous value (?pV) 
            (> [(?pV) (?v)])          

            ;; No? New value (?v) must be more than previous value (?pV) 
            (< [(?pV) (?v)])           
        )
    ]
)
```

The database function checks whether you are the root user (`(== [0 (?auth_id)])`). If so, you have no restrictions on which crypto you can add or remove. In your own cryptocurrency, you can choose whether or not to include a "backdoor" for a root user. 

If you are not the root user, the function checks whether you are transacting your own crypto or not (`(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))`). 

If you are transacting your own crypto, the new `crypto/balance` value has to be less than the previous value (`(> [(?pV) (?v)])`). 

If you are transacting another user's crypto, the new `crypto/balance` value has to be greater than the previous value (`(< [(?pV) (?v)])`).


In order to put this `_fn/code` into effect, you need to first create a function, and then add it to the `crypto/balance` attribute spec. 

```
[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]
```

#### Restrict Crypto Spending


```json
[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])  (if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation restrictCrypto ($restrictCryptoTx: JSON) {
  transact(tx: $restrictCryptoTx)
}

{
  "restrictCryptoTx": "[
      {\"_id\":\"_fn$subtractOwnAddOthers?\",\"name\":\"subtractOwnAddOthers?\",\"code\":\"(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\\\"crypto/user\\\" \\\"_id\\\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])\",\"doc\":\"You can only add to others balances, and only subtract from your own balance\"},{\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"spec\":[\"_fn$subtractOwnAddOthers?\"],\"specDoc\":\"You can only add to others balances, and only subtract from your own balance.\"}]"
}
```

### Testing Our Crypto

We are not quite done with our example yet, but we can test it to this point. Make sure to refresh your UI, so that you can select "cryptoWoman" as the user (in the sidebar).

Cryptowoman will attempt to add 5 to her own `crypto/balance`. When we attempt the below transaction, we should get the error message, 
"You can only add to others balances, and only subtract from your own balance."

```
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205
}]
```

When she attempts to subtract from her own account, she can do so successfully. 

```
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195
}]
```

Even if she doesn't know her current balance, she can use the database function, `(?pV)` to get the previous value of her `crypto/balance`.

```
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

She is also able to add to cryptoMan's balance.

```
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"
}]
```

However, she is not able to remove money from cryptoMan's balance. 

```
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

#### CryptoWoman Can't Add To Her Own Account

```json
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205 }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\": "[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":205}]"
}
```

#### CryptoWoman Can Withdraw From Her Own Account

```json
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195 }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\":"[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":195}]"
}
```

#### CryptoWoman Can Withdraw From Her Own Account Using a Database Function

```json
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])" }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation removeCryptoWoman ($removeCryptoWomanTx: JSON) {
  transact(tx: $removeCryptoWomanTx)
}

{
  "removeCryptoWomanTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

#### CryptoWoman Can Add to CryptoMan's Wallet

```json
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoMan ($addCryptoManTx: JSON) {
  transact(tx: $addCryptoManTx)
}

{
  "addCryptoManTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 5])\"}]"
}
```

#### CryptoWoman Cannot Withdraw From CryptoMan's Wallet

```json
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation removeCryptoMan ($removeCryptoManTx: JSON) {
  transact(tx: $removeCryptoManTx)
}

{
  "removeCryptoManTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

### Crypto Spent = Crypto Received

Now, we can add a spec, which makes sure that the total balance added to one (or several accounts) is equal to the amount subtracted from another account. For this purpose, we can use the `txSpec` attribute. `_attribute/spec`, which we used to ensure that balances are non-negative, checks every flakes in a transaction that contains a given attribute. On the other hand `_attribute/txSpec` is run once *per attribute* in a transaction. For example, if we create an `_attribute/txSpec` for `crypto/balance`, our transactor will group together every flake that changes the `crypto/balance` attribute and only run the `txSpec`
*once*. `txSpec` allows use to do things like sum all the crypto/balance values in a transaction.

The function `(valT)` takes no arguments, and sums all the true flakes in a transaction for the given `_attribute`. Likewise, the function `(valF)` takes no arguments, and sums all the false flakes in a transaction for the given `_attribute`. We want to make sure that the sum of all of the `crypto/balance`s being retracted equals the sum of those being added. 

```
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

#### Crypto Spent = Crypto Received

```json
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation cryptoSpentReceived ($cryptoSpentReceivedTx: JSON) {
  transact(tx: $cryptoSpentReceivedTx)
}

{
  "cryptoSpentReceivedTx": "[{\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"txSpec\":[\"_fn$evenCryptoBalance\"],\"txSpecDoc\":\"The values of added and retracted crypto/balance flakes need to be equal\"},{\"_id\":\"_fn$evenCryptoBalance\",\"name\":\"evenCryptoBalance?\",\"code\":\"(== [(valT) (valF)])\",\"doc\":\"The values of added and retracted crypto/balance flakes need to be equal\"}]"
}
```

### Final Test  

Now, all the pieces of our cryptocurrency are in place. We have created a cryptocurrency with the following features:

1. Balances can never be negative.
2. A user may only withdraw from their own account. 
3. A user may only add to another user's account.
4. When withdrawing or adding, the amount withdraw has to equal the amount added. 

For example, with our final cryptocurrency, no user can perform the following transaction, because it violates feature #4, as listed about.

```
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

The following transaction spends as much cryptocurrency as it receives. However, because it is withdrawing from cryptoMan's Wallet and adding to cryptoWoman's wallet, only cryptoMan can initiate the transaction. 

```
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(+ [(?pV) 10])"
}]
```

#### The Amount Added Has To Equal The Amount Withdrawn

```json
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 10])\"},{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

#### CryptoMan Can Perform This Transaction

```json
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 10])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 10])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 10])\"},{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 10])\"}]"
}
```