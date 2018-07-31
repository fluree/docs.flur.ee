# Examples

## Cryptocurrency

```
[{
    "_id": "_stream",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int",
    "spec": "(< [-1 ?v])",
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictStream": "_user"
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
    "rules": ["_rule$editOwnCrypto"]
    },
    {
    "_id": "_rule$editOwnCrypto",
    "id": "editOwnCrypto",
    "predicate": "(== [?user (get ?e \"crypto/user\" )])",
    "ops": ["query", "transact"],
    "stream": "crypto",
    "streamDefault": true
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



Enable something like this:

[{
    "_id": ["crypto/user", ["_user/username", "cryptoMan"]],
    "balance": "#(+ [?v 20])"
}]



For now -> if it's you, you can do 100, if it's not 0. but you can't edit another person's, so it doesn't matter. 

[{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": "(if-else (== [(get-in (?e) [\"crypto/user\" \"_id\"]) (get (?user) \"_id\")]) (== [100 ?v]) (== [0 ?v]) )"
}]