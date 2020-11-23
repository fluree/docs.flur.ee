
### Cryptocurrency

This example outlines how a user can create a simple cryptocurrency using Fluree. The user will be able to check their own balance and add to other users' balances. 

### Schema

The first step is to create a `crypto` collection with the attributes `crypto/balance`, which tracks the amount of currency each user has, `crypto/user`, which references a ledger `_user`, and `crypto/walletName`, which is a unique name for the entity. 

```all
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

Next, we add an `_attribute/spec` that makes sure our `crypto/balance` is never negative. The code for this is `(< [-1 (?v)])`. To see how to properly format ledger functions, you can visit [Function Syntax](#function-syntax).

Note, this transaction, and many of the subsequent transactions can be combined. We separate out these transactions here for demonstration purposes. 

```all
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

In preparation for creating users, we create a function, which checks whether the current entity's `crypto/user` is the same as the user. We will also be using the built-in functions, `["_fn/name", "true"]` and `["_fn/name", "false"]`.

```all
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
}]
```

Next, we create two users with `_user/username` cryptoMan and cryptoWoman, as well as two auth records- one for each user. Both auth records are given the `_role`, cryptoUser. A cryptoUser can query their `crypto`, and `transact` on any `crypto/balance`. No one, other than the root user can transact on `crypto/user`. 


```all
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

#### Creating Ledger Functions

```flureeql
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
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
}]' \
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
```

```graphql
mutation nonNegativeBalance ($dbFunTx: JSON) {
  transact(tx: $dbFunTx)
}

{
  "dbFunTx": "[{\"_id\":\"_fn$ownCrypto\",\"name\":\"ownCrypto?\",\"code\":\"(contains? (get-all (?e) [\\\"crypto/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}
```

#### Adding Users and Permissions

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

Once we create these two users, we can give each user a crypto/balance. Note, if you will want more than 400 `crypto/balance` in your ledger, you will need to add additional users and additional `crypto/balance` at this point in the example. Once we put additional rules in place, no user will be able create `crypto/balance` from nothing without changing the rules that govern the ledger. 

```all
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
```all
{
  "tempids": {
    "crypto$1": 4307852197889,
    "crypto$2": 4307852197890
  },
  "block": 19,
  "hash": "73768d386d665be5b233f76f053a790964d70a1d322cd0e90d8883f4793cb8f0",
  "txid": "9689fb79e7c6822c3f33f49f04c94ec8c2f0e876b9b3aafc505659ca1c595fc6",
  "fuel-remaining": 999999957356,
  "authority": null,
  "signature": "1b3044022021444c6cc9c0cb50b693d0fd3faded5a4bd91c7a19a20a974070300fcd8fd2ff02206f184264f11ddd36bec5db706c227ada846048a29eaca3ae2b42ec893f91b850",
  "time": "22.40ms",
  "fuel": 2265,
  "auth": 25769803776,
  "tx-entid": -1245184,
  "tx": "[{\"_id\":\"crypto\",\"walletName\":\"cryptoWoman's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoWoman\"]},{\"_id\":\"crypto\",\"walletName\":\"cryptoMan's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoMan\"]}]",
  "status": 200,
  "block-bytes": 755,
  "timestamp": 1535472759449,
  "flakes": [
     [ 4307852197890, 1009, 200, -1245184, true, null ],
     [ 4307852197890, 1010, 21474837480, -1245184, true, null ],
     [ 4307852197890, 1011, "cryptoMan's Wallet", -1245184, true, null ],
     [ 4307852197889, 1009, 200, -1245184, true, null ],
     [ 4307852197889, 1010, 21474837481, -1245184, true, null ],
     [ 4307852197889, 1011, "cryptoWoman's Wallet", -1245184, true, null ],
     [ -1245184, 1, "73768d386d665be5b233f76f053a790964d70a1d322cd0e90d8883f4793cb8f0", -1245184, true, null ],
     [ -1245184, 2, "c1de4911f3c5da564e576bcf121715d60745101a27bcefd5fd4e33d73674167b", -1245184, true, null ],
     [ -1245184, 5, 1535472759449, -1245184, true, null ],
     [ -1245184, 100, "9689fb79e7c6822c3f33f49f04c94ec8c2f0e876b9b3aafc505659ca1c595fc6", -1245184, true, null ],
     [ -1245184, 101, 25769803776, -1245184, true, null ],
     [ -1245184, 103, 1535472759446, -1245184, true, null ]
  ]
}
```

#### Adding Crypto/Balance


```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

```all
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

The ledger function checks whether you are the root user (`(== [0 (?auth_id)])`). If so, you have no restrictions on which crypto you can add or remove. In your own cryptocurrency, you can choose whether or not to include a "backdoor" for a root user. 

If you are not the root user, the function checks whether you are transacting your own crypto or not (`(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))`). 

If you are transacting your own crypto, the new `crypto/balance` value has to be less than the previous value (`(> [(?pV) (?v)])`). 

If you are transacting another user's crypto, the new `crypto/balance` value has to be greater than the previous value (`(< [(?pV) (?v)])`).


In order to put this `_fn/code` into effect, you need to first create a function, and then add it to the `crypto/balance` attribute spec. 

```all
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


```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205
}]
```

When she attempts to subtract from her own account, she can do so successfully. 

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195
}]
```

Even if she doesn't know her current balance, she can use the ledger function, `(?pV)` to get the previous value of her `crypto/balance`.

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

She is also able to add to cryptoMan's balance.

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"
}]
```

However, she is not able to remove money from cryptoMan's balance. 

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

#### CryptoWoman Can't Add To Her Own Account

```flureeql
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
   https://db.flur.ee/api/db//$FLUREE_ACCOUNT/$FLUREE_DBquery
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

#### CryptoWoman Can Withdraw From Her Own Account Using a Ledger Function

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

The function `(objT)` takes no arguments, and sums all the true flakes in a transaction for the given `_attribute`. Likewise, the function `(objF)` takes no arguments, and sums all the false flakes in a transaction for the given `_attribute`. We want to make sure that the sum of all of the `crypto/balance`s being retracted equals the sum of those being added. 

```all
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(objT)  (objF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

#### Crypto Spent = Crypto Received

```flureeql
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(objT)  (objF)])",
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
    "code": "(== [(objT)  (objF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]' \
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
```

```graphql
mutation cryptoSpentReceived ($cryptoSpentReceivedTx: JSON) {
  transact(tx: $cryptoSpentReceivedTx)
}

{
  "cryptoSpentReceivedTx": "[{\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"txSpec\":[\"_fn$evenCryptoBalance\"],\"txSpecDoc\":\"The values of added and retracted crypto/balance flakes need to be equal\"},{\"_id\":\"_fn$evenCryptoBalance\",\"name\":\"evenCryptoBalance?\",\"code\":\"(== [(objT) (objF)])\",\"doc\":\"The values of added and retracted crypto/balance flakes need to be equal\"}]"
}
```

### Final Test  

Now, all the pieces of our cryptocurrency are in place. We have created a cryptocurrency with the following features:

1. Balances can never be negative.
2. A user may only withdraw from their own account. 
3. A user may only add to another user's account.
4. When withdrawing or adding, the amount withdraw has to equal the amount added. 

For example, with our final cryptocurrency, no user can perform the following transaction, because it violates feature #4, as listed about.

```all
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

```all
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
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

```flureeql
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
   https://db.flur.ee/api/db/$FLUREE_ACCOUNT/$FLUREE_DB/query
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 10])\"},{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 10])\"}]"
}
```
