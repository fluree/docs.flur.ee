## Cryptocurrency

This example outlines how a user can create a simple cryptocurrency using FlureeDB. The user will be able to check their own balance and add to other users' balances. 

### Create a Schema

The first step is to create a `wallet` collection with the predicates `wallet/balance`, which tracks the amount of currency each user has, `wallet/user`, which references a database `_user`, and `wallet/Name`, which is a unique name for the subject. 

```flureeql
[{
    "_id": "_collection",
    "name": "wallet"
}, 
{
    "_id": "_attribute",
    "name": "wallet/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "wallet/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "wallet/name",
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
    "name": "wallet"
}, 
{
    "_id": "_attribute",
    "name": "wallet/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "wallet/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "wallet/name",
    "type": "string",
    "unique": true
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation cryptoSchema ($mycryptoSchemaTx: JSON) {
  transact(tx: $mycryptoSchemaTx)
}

{
  "mycryptoSchemaTx": "[{\"_id\":\"_collection\",\"name\":\"wallet\"},{\"_id\":\"_attribute\",\"name\":\"wallet/balance\",\"type\":\"int\"},{\"_id\":\"_attribute\",\"name\":\"wallet/user\",\"type\":\"ref\",\"restrictCollection\":\"_user\"},{\"_id\":\"_attribute\",\"name\":\"wallet/name\",\"type\":\"string\",\"unique\":true}]"
}
```

```sparql
Transactions are not supported in SPARQL
```

### Add Sample Data

According to [Fluree Best Practices](/docs/infrastructure/application-best-practices), after creating a schema, you should add in your sample data or initial data. 

We'll be creating two users, and two wallets.

```all
[{
    "_id": "_user$cryptoMan",
    "username": "cryptoMan"
     }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman"
    }, 
    {
    "_id": "wallet$cryptoMan",
    "name": "cryptoMan",
    "balance": 200,
    "user": "_user$cryptoMan"
    },
   {
    "_id": "wallet$cryptoWoman",
    "name": "cryptoWoman",
    "balance": 200,
    "user": "_user$cryptoWoman"
    }]
```

### Deciding Who Can Edit What

Now, we are going to create rules around who can edit which predicates. Note that there are many ways of building the same application. The steps in this tutorial are not the only way, and may not even be the best way!

We're going to place the following restrictions on the predicates in the `wallet` collection:

- `wallet/name` - only the owner of the wallet can edit
- `wallet/balance` - anyone can edit
- `wallet/user` - no one can edit. 

First, we're going to create a function, which checks to see if the user attempting to make the update `(?user_id)` is the owner of the wallet. The full function is: `(contains? (get-all (?s) [\"wallet/user\" \"_id\"]) (?user_id))`. This function starts with `(?s)`, which is the subject being updated. We `get-all` the `_id`s from the `wallet/user`s for that wallet. `get-all` returns a set. In this case, it is a set of one, single `_id`. Then we see if the set of `_id`s for the current `wallet/user`s contains the `_id` of the `_user` currently making the update `(?user_id)`. 

```flureeql
[{
    "_id": "_fn$ownWallet",
    "name": "ownWallet?",
    "code": "(contains? (get-all (?s) [\"wallet/user\" \"_id\"]) (?user_id))"
},
   {
    "_id": "_rule$editOwnWalletName",
    "id": "editOwnWalletName",
    "doc": "A cryptoUser can only edit their own wallet/name",
    "fns": ["_fn$ownWallet"],
    "ops": ["transact"],
    "collection": "wallet",
    "predicates":  ["wallet/name”],
}]
```

Then, we'll use the built-in smart functions, `true` and `false` to make sure `wallet/balance` can be updated by anyone, and the `wallet/user` cannot be edited by anyone. 

```flureeql
[{
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any wallet/balance.",
    "fns": [["_fn/name", "true"]],
    "ops": ["all"],
    "collection": "wallet",
    "predicates": ["wallet/balance"]
    },

    {
    "_id": "_rule$cantEditWalletUser",
    "id": "cantEditWalletUser",
    "doc": "No one should ever be able to edit a wallet/user",
    "ops": ["transact"],
    "collection": "wallet",
    "predicates": ["wallet/user"],
    "fns": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a wallet/user. "
  }]
```

Now, we have three rules that we need to connect to the users. In order to do this, we'll group all three rules into `cryptoUser` role, create two new `_auth` records, and add those `_auth` records to our `cryptoMan` and `cryptoWoman` users. 

```flureeql
[ {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": [["_rule/id", "cantEditWalletUser"], 
["_rule/id", "editAnyCryptoBalance"],
["_rule/id", "editOwnWalletName"]]  },
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
    "_id": ["_user/username", "cryptoMan"],
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": ["_user/username", "cryptoWoman"],
    "auth": ["_auth$cryptoWoman"]
    }]
```

### Ensure Balance Non-Negative

Next, we add an `_predicate/spec` that makes sure our `crypto/balance` is never negative. The code for this is `(< -1 (?o))`. To see how to write smart functions, you can go to the [Smart Function](/docs/smart-functions/smart-functions) section.

Note, this transaction, and many of the subsequent transactions can be combined. We separate out these transactions here for demonstration purposes. 

```flureeql
[{  "_id":  ["_predicate/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< -1 (?o))"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{  "_id":  ["_predicate/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< -1 (?o))"
}]' \
   [HOST]/transact
```

```graphql
mutation nonNegativeBalance ($nonNegativeBalanceTx: JSON) {
  transact(tx: $nonNegativeBalanceTx)
}

{
  "nonNegativeBalanceTx": "[
      {\"_id\":[\"_predicate/name\",\"crypto/balance\"],\"spec\":[\"_fn$nonNegative?\"],\"specDoc\":\"Balance cannot be negative.\"},{\"_id\":\"_fn$nonNegative?\",\"name\":\"nonNegative?\",\"code\":\"(< -1 (?o))\"}]"
}
```

```sparql
Transactions are not supported in SPARQL
```

### Restrict Crypto Spending

At this point, we have a fairly useless cryptocurrency. Anyone can transact anyone else's `wallet/balance`, and there are no protections against someone transacting your `wallet/balance` to 0. In order to prevent this, we can create a rule that only allows you to withdraw from your own `wallet/balance` or deposit in another user's `wallet/balance`.

```flureeql
[{
        "_id": "_fn$subtractOwnAddOthers?",
        "name": "subtractOwnAddOthers?",
        "code": "(if-else (ownWallet?)  (> (?pO) (?o)) (< (?pO) (?o))))",
        "doc": "You can only add to others balances, and only subtract from your own balance"
    },
    {
        "_id": ["_predicate/name", "wallet/balance"],
        "spec": ["_fn$subtractOwnAddOthers?"],
        "specDoc": "You can only add to others balances, and only subtract from your own balance. No balances may be negative"
    }]
```


```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
        "_id": "_fn$subtractOwnAddOthers?",
        "name": "subtractOwnAddOthers?",
        "code": "(if-else (ownWallet?)  (> (?pO) (?o)) (< (?pO) (?o))))",
        "doc": "You can only add to others balances, and only subtract from your own balance"
    },
    {
        "_id": ["_predicate/name", "wallet/balance"],
        "spec": ["_fn$subtractOwnAddOthers?"],
        "specDoc": "You can only add to others balances, and only subtract from your own balance. No balances may be negative"
    }]' \
   [HOST]/transact
```

```graphql
mutation restrictCrypto ($restrictCryptoTx: JSON) {
  transact(tx: $restrictCryptoTx)
}

{
  "restrictCryptoTx": "[{\"_id\":\"_fn$subtractOwnAddOthers?\",\"name\":\"subtractOwnAddOthers?\",\"code\":\"(if-else (ownWallet?)  (> (?pO) (?o)) (< (?pO) (?o))))\",\"doc\":\"You can only add to others balances, and only subtract from your own balance\"},{\"_id\":[\"_predicate/name\",\"wallet/balance\"],\"spec\":[\"_fn$subtractOwnAddOthers?\"],\"specDoc\":\"You can only add to others balances, and only subtract from your own balance. No balances may be negative\"}]"
}
```

### Testing Our Crypto

We are not quite done with our example yet, but we can test it to this point. Make sure to refresh your UI, so that you can select "cryptoWoman" as the user (in the sidebar).

Cryptowoman will attempt to add 5 to her own `wallet/balance`. When we attempt the below transaction, we should get the error message, "You can only add to others balances, and only subtract from your own balance."

```flureeql
[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": 205
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": 205
}]' \
   [HOST]/transact
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\": "[\"wallet/name\",\"cryptoWoman\"],\"balance\":205}]"
}
```

```sparql
Transactions not supported
```

When she attempts to subtract from her own account, she can do so successfully. 

```flureeql
[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": 195
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": 195
}]' \
   [HOST]/transact
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\": "[\"wallet/name\",\"cryptoWoman\"],\"balance\":195}]"
}
```

```sparql
Transactions not supported
```

Even if she doesn't know her current balance, she can use the database function, `(?pO)` to get the previous value of her `wallet/balance`.


```flureeql
[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": "#(- (?pO) 5)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoWoman"],
    "balance": "#(- (?pO) 5)"
}]' \
   [HOST]/transact
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[{\"_id\":[\"wallet/name\",\"cryptoWoman\"],\"balance\":\"#(- (?pO) 5)\"}]"
}
```

```sparql
Transactions not supported
```

She is also able to add to cryptoMan's balance.

```flureeql
[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(+ (?pO) 5)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(+ (?pO) 5)"
}]' \
   [HOST]/transact
```

```graphql
mutation addCryptoMan ($addCryptoManTx: JSON) {
  transact(tx: $addCryptoManTx)
}

{
  "addCryptoManTx": "[{\"_id\":[\"wallet/name\",\"cryptoMan\"],\"balance\":\"#(+ (?pO) 5)\"}]"
}
```

```sparql
Transactions not supported
```

However, she is not able to remove money from cryptoMan's balance. 


```flureeql
[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(- (?pO) 5)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(- (?pO) 5)"
}]' \
   [HOST]/transact
```

```graphql
mutation addCryptoMan ($addCryptoManTx: JSON) {
  transact(tx: $addCryptoManTx)
}

{
  "addCryptoManTx": "[{\"_id\":[\"wallet/name\",\"cryptoMan\"],\"balance\":\"#(- (?pO) 5)\"}]"
}
```

```sparql
Transactions not supported
```

### Crypto Spent = Crypto Received

Now, we can add a spec, which makes sure that the total balance added to one (or several accounts) is equal to the amount subtracted from another account. For this purpose, we can use the `txSpec` predicate. `_predicate/spec`, which we used to ensure that balances are non-negative, checks every flakes in a transaction that contains a given predicate. On the other hand `_predicate/txSpec` is run once *per predicate* in a transaction. For example, if we create an `_predicate/txSpec` for `wallet/balance`, our transactor will group together every flake that changes the `wallet/balance` predicate and only run the `txSpec` *once*. `txSpec` allows use to do things like sum all the wallet/balance values in a transaction.

The function `(valT)` takes no arguments, and sums all the true flakes in a transaction for the given `_predicate`. Likewise, the function `(valF)` takes no arguments, and sums all the false flakes in a transaction for the given `_predicate`. We want to make sure that the sum of all of the `wallet/balance`s being retracted equals the sum of those being added. 

```flureeql
[{
    "_id": ["_predicate/name", "wallet/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== (valT)  (valF))",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```


```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "wallet/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== (valT) (valF))",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]' \
   [HOST]/transact
```

```graphql
mutation cryptoSpentReceived ($cryptoSpentReceivedTx: JSON) {
  transact(tx: $cryptoSpentReceivedTx)
}

{
  "cryptoSpentReceivedTx": "[{\"_id\":[\"_predicate/name\",\"wallet/balance\"],\"txSpec\":[\"_fn$evenCryptoBalance\"],\"txSpecDoc\":\"The values of added and retracted crypto/balance flakes need to be equal\"},{\"_id\":\"_fn$evenCryptoBalance\",\"name\":\"evenCryptoBalance?\",\"code\":\"(== (valT) (valF))\",\"doc\":\"The values of added and retracted crypto/balance flakes need to be equal\"}]"
}
```

```sparql
Transactions not supported
```

### Final Test  

Now, all the pieces of our cryptocurrency are in place. We have created a cryptocurrency with the following features:

1. Balances can never be negative.
2. A user may only withdraw from their own account. 
3. A user may only add to another user's account.
4. When withdrawing or adding, the amount withdraw has to equal the amount added. 

For example, with our final cryptocurrency, no user can perform the following transaction, because it violates feature #4, as listed about.

```flureeql
[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(+ (?pO) 10)"
},
{
    "_id": ["wallet/name", "cryptWoman"],
    "balance": "#(- (?pO) 5)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(+ (?pO) 10)"
},
{
    "_id": ["wallet/name", "cryptWoman"],
    "balance": "#(- (?pO) 5)"
}]' \
   [HOST]/transact
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"wallet/name\",\"cryptoMan\"],\"balance\":\"#(+ (?pO) 10)\"},{\"_id\":[\"wallet/name\",\"cryptWoman\"],\"balance\":\"#(- (?pO) 5)\"}]"
}
```

```sparql
Transactions not supported
```

The following transaction spends as much cryptocurrency as it receives. However, because it is withdrawing from cryptoMan and adding to cryptoWoman, only cryptoMan can initiate the transaction. 

```flureeql
[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(- (?pO) 10)"
},
{
    "_id": ["wallet/name", "cryptWoman"],
    "balance": "#(+ (?pO) 10)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["wallet/name", "cryptoMan"],
    "balance": "#(- (?pO) 10)"
},
{
    "_id": ["wallet/name", "cryptWoman"],
    "balance": "#(+ (?pO) 10)"
}]' \
   [HOST]/transact
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"wallet/name\",\"cryptoMan\"],\"balance\":\"#(- (?pO) 10)\"},{\"_id\":[\"wallet/name\",\"cryptWoman\"],\"balance\":\"#(+ (?pO) 10)\"}]"
}
```

```sparql
Transactions not supported
```
