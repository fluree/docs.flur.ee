## Signatures

In Fluree, we take the SHA3-256 of the original transaction, and sign it with the issuer's private key. This signature conforms to [RFC 6979](https://tools.ietf.org/html/rfc6979).

For both queries and transactions, a signature is not required if the option `fdb-group-open-api` is set to true (default [config option](/docs/getting-started/installation#config-options) for the downloaded version of Fluree). 

If you do need to specify a signature, the signature may either be in the Authorization header (for all queries submitted) or in the signature map (for all transactions).

### Signed Queries
If `fdb-group-open-api` is set to true, then you do not need to sign your queries. If you do need to sign your queries, you should have access to your private key. Your private key needs to be [connected to a valid auth record](/docs/identity/auth-records) in the database.

You should include the following header in your request (using the API): 

```all
"Authorization": "Bearer [RFC 6979 SIGNATURE]"
```

The signature should be the SHA3-256 of the original query, signed with your private key, according to [RFC 6979](https://tools.ietf.org/html/rfc6979) standards.

### Signed Transactions
If `fdb-group-open-api` is set to true, then you do not need to sign your transactions.

Each database comes with a default auth record, which is stored in the `_db/anonymous` predicate in that database.

Optionally, in a given transaction, you can include an alternate auth record with which to sign your transaction. This is done by passing in an additional map with your transaction. The additional map should be in the `_tx` collection. The predicates in the `_tx` collection are specified below:

Predicate | Type | Description
-- | -- | -- 
`_tx/id` | `string` |  (optional) A unique identifier for this tx.
`_tx/auth` | `ref` | (optional) A reference to the `_auth` for this transaction. This auth signs the transaction.
`_tx/authority` | `ref` | (optional) A reference to an `_auth` record that acts as an authority for this transaction. 
`_tx/nonce` | `long` | (optional) A nonce that helps ensure identical transactions have unique txids, and also can be used for logic within smart functions (not yet implemented). . Note this nonce does not enforce uniqueness, use _tx/altId if uniqueness must be enforced.
`_tx/altId` | `string` | (optional) Alternative Unique ID for the transaction that the user can supply.

For example, I could specify a  `_tx/id`, `_tx/auth`, `_tx/nonce` in my transaction as follows. 

```all
[{
    "_id": "_collection",
    "name": "movie"
},
{
    "_id": "_tx",
    "auth": ["_auth/id", "8ykdsldf329433"]
    "id": "moviesColl",
    "nonce": 123456789
}]
```

### Private Key

The private key that signs is not determined by the auth record that you may or may not specify in the transaction. Rather it is determined by your network and database configuration.

Every node of Fluree can either specify a private key or private key file location (as [configured at start-up](/docs/getting-started/installation#config-option)). If neither is specified, a `default-private-key.txt` file will be created when an instance of Fluree starts up for the first time, and an assocatied auth record that corresponds to the private key will be added to the master database with root access.  

If a particular [auth is specified in the transaction](/api/signed-endpoints/signatures#signed-transactions), then the default auth record signs the transaction and is listed as the [authority](/docs/identity/auth-records#authority), while the specified auth is listed as the transaction `_auth`. 

Even if no auth record is specified, the transaction will be signed by the default auth or anonymous auth. All transactions are signed, regardless of the database or network configuration.

### Verifying Signatures

ECDSA allows for recovery of the public key from a signature, so the original transaction and signature are the only two things required in order to verify that a signature is valid. There are online tools that allow you to independently verify a signature based on the signature + original transaction. 

