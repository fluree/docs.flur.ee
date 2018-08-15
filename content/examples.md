# Examples

## Cryptocurrency

```
[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int",
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]
```


```
[   {
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
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCrypto"]
    },
    {
    "_id": "_rule$editAnyCrypto",
    "id": "editAnyCrypto",
    "predicate": ["_fn$alwaysTrue"],
    "ops": ["transact"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "predicate": ["_fn$ownCrypto"],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
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
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "crypto",
    "balance": 200,
    "user": "_user$cryptoWoman"
    },
    {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "crypto",
    "balance": 200,
    "user": "_user$cryptoMan"
}]
```


``` Base currency
CryptoWoman Id -> {
    "select": [{"crypto/_user": ["*"]}],
    "from": ["_user/username", "cryptoWoman"]
}

CryptoMan Id -> {
    "select": [{"crypto/_user": ["*"]}],
    "from": ["_user/username", "cryptoMan"]
}

>> CryptoMan -> 4294967296002
>> CryptoWoman -> 4294967296001

[{
    "_id": 4294967296002,
    "balance": 200
},
{
    "_id": 4294967296001,
    "balance": 200
}]
```


Now - queries
{
    "select": ["*"],
    "from": "crypto"
}

As root, you can see ALL the crypto. 
As cryptoMan, you can only see your own crypto.
As cryptoWoman, you can only see your own crypto. 

But, you can transact any crypto. Let's add one restriction to that:

```
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
},
{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id)) (> [(?pV) (?v)]) (< [(?pV) (?v)]) )",
    "doc": "You can only add to others balances, and only subtract from your own balance"
}]
```

Now let's test it out.

Cryptowoman will attempt to add 5 to her balance, she shouldn't be able to. 

```
[{
    "_id": 4294967296001,
    "balance": 205
}]
```

Good. But she can subtract from her balance

```
[{
    "_id": 4294967296001,
    "balance": 195
}]
```

She can also subtract using (?pV)

```
[{
    "_id": 4294967296001,
    "balance": "#(- [(?pV) 5])"
}]
```

She can add to cryptoMan's balance

```
[{
    "_id": 4294967296001,
    "balance": "#(- [(?pV) 5])"
}]
```

Now, we can add a spec, which makes sure that the total balance added to one (or several accounts) is equal to the amount subtracted from another account. For this purpose, we can use the `txSpec` attribute. `_attribute/spec`, which we used to ensure that balances are non-negative, checks every flakes in a transaction that contains a given attribute. On the other hand `_attribute/txSpec` is run once *per attribute* in a transaction. For example, if we create an `_attribute/txSpec` for `crypto/balance`, our transactor will group together every flake that changes the `crypto/balance` attribute and only run the `txSpec` *once*. `txSpec` allows use to do things like sum all the crypto/balance values in a transaction.

```
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT (flakes))  (valF (flakes)) ] )",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

Now cryptoMan attempts:

```
[{
    "_id": 4294967296001,
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": 4294967296002,
    "balance": "#(- [(?pV) 5])"
}]
```

And it doesn't work. But this does. 

```
[{
    "_id": 4294967296001,
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": 4294967296002,
    "balance": "#(- [(?pV) 10])"
}]
```