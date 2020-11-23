## Signatures

For both queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default for the downloaded version of Fluree). 

If you do need to specify a signature, the signature may either be in the Authorization header (for all queries submitted) or in the signature map (for all transactions).

Any requests sent to `/query`, `/multi-query`, `/block`, `/history`, `/sparql`, and any queries submitted through `/graphql` should have a signature in Authorization header (if `fdb-open-api` is set to false) [signed queries](#signed-queries). To submit a signed transaction, you need to use the `/command` endpoint.

### Signed Queries
If `fdb-open-api` is set to true, then you do not need to sign your queries. If you do need to sign your queries, you should have access to your private key. Your private key needs to be [connected to a valid auth record](/docs/identity/auth-records) in the ledger.

You should include the following header in your request (using the API): 

```all
"Authorization": "Bearer [RFC 6979 SIGNATURE]"
```

The signature should be the SHA2-256 of the original query, signed with your private key, according to [RFC 6979](https://tools.ietf.org/html/rfc6979) standards.

### Signed Transactions
If `fdb-open-api` is set to true, then you do not need to sign your transactions. You can issue transactions to the `/transact` endpoint, and they will be automatically signed.  

Each ledger comes with a default auth record, which is either provided by you or automatically generated (see [config options](/docs/getting-started/installation#config-options)). If `fdb-open-api` is set to true, then all transactions will be signed with this default private key unless otherwise specified. 

All signed transactions need to be submitted to the [`/command` endpoint](/api/downloaded-endpoints/overview). The `/command` endpoint takes a map with two keys:

Key | Description
--- | ---
cmd | Stringified command map
sig | ECDSA signature of the value of the cmd key. 

When submitting a transaction, the command map of type `tx` (transaction) needs to have the following keys in the following order. Documentation on command of type `new-db` and `default-key` is forthcoming. 

Key | Description
--- | ---
type | `tx`, `new-db`, or `default-key`. 
db | `network/dbid`
tx | The body of the transaction
auth | `_auth/id` of the auth
fuel | Max integer for the amount of fuel to use for this transaction
nonce | Integer nonce, to ensure that the command map is unique.
expire | Epoch milliseconds after which point this transaction can no longer be submitted. 

For help with submitting a transaction to the `/cmd` endpoint, you can use the user interface found in `/flureeql`. Select `transact` in the top right, and then select `Own Private Key` in the middle of the top row. 

We also have a <a href="https://github.com/fluree/crypto-utils" target="_blank">cryptography GitHub repo</a>.

You can see examples of how to use signed transaction in the [Cryptocurrency](/docs/examples/cryptocurrency), [Voting](/docs/examples/voting), and [Supply Chain](/docs/examples/supply-chain) sample apps. 

### Authority

Every transaction is signed by an `_auth` record. By default, every network has a default private key, and each new ledger in that automatically includes an auth record with an `_auth/id` that is connected to the private key and with root permissions.


