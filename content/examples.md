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



Enable something like this:

[{
    "_id": ["crypto/user", ["_user/username", "cryptoMan"]],
    "balance": "#(+ [?v 20])"
}]



For now -> if it's you, you can do 100, if it's not 0. but you can't edit another person's, so it doesn't matter. 

[{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": "(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id)) (> [?pV ?v]) (< [?pV ?v]) )"
}]