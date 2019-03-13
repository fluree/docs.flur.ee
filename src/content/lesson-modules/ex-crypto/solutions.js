export default { 
    "1": [  "٩(̾●̮̮̃̾•̃̾)۶", "No challenge here!",
        "Click Next to keep going!", "You rock!"],
    "2": [{
        "_id": "_collection",
        "name": "wallet"
    }, 
    {
        "_id": "_predicate",
        "name": "wallet/balance",
        "type": "int"
    },
    {
        "_id": "_predicate",
        "name": "wallet/user",
        "type": "ref",
        "restrictCollection": "_user"
    },
    {
        "_id": "_predicate",
        "name": "wallet/name",
        "type": "string",
        "unique": true
    }],
    "3": [{
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
        }],
        "4": ["There is more than one right answer!",
        "This is just one solution",
    "1. A. Only the user",
    "2. D. Anyone. You'll see why we make this choice",
    "3. C. No one."],
    "5": "(contains? (get-all (?e) [\"wallet/user\" \"_id\"]) (?user_id))",
    "6": [{
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
      }],
    "7": [ {
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
        }],
    "8": ["There are several ways. Here are two", 
            "(>= (?o) 0)",
            "(> (?o) -1"],
    "9": [{
        "_id": "_fn$subtractOwnAddOthers?",
        "name": "subtractOwnAddOthers?",
        "code": "(if-else (ownWallet?)  (> (?pV) (?v)) (< (?pV) (?v))))",
        "doc": "You can only add to others balances, and only subtract from your own balance"
    },
    {
        "_id": ["_predicate/name", "wallet/balance"],
        "spec": ["_fn$subtractOwnAddOthers?"],
        "specDoc": "You can only add to others balances, and only subtract from your own balance. No balances may be negative"
    }],
    "10": "(== (objT)  (objF))",
    "11":[  "Ƹ̵̡Ӝ̵̨̄Ʒ", "No challenge here!",
    "You're all done with this section!", "You rock!"],
}

                    