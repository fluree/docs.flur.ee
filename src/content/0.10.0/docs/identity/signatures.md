## Signatures

In Fluree, you can sign both queries and transactions. The signature proves that the issuer of a given query or transaction has access to the private key associated with the signature. See [Public and Private Keys](/docs/identity/public-private-keys) for a primer on public-private key cryptography.  

Fluree signatures comply to [RFC 6979](https://tools.ietf.org/html/rfc6979) standards.

### `fdb-open-api`
For both queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default [config option](/docs/getting-started/installation#config-options) for the downloaded version of Fluree). In fact, the signature in signed query will be ignored if `fdb-open-api` is set to true. 

In the case of transactions, if you send a transaction to `/transact` or to `/graphql`, the transaction will be signed with a default private key. 

If you do need to specify a signature, such as in the case of testing out user permissions, you can submit a [signed transaction](#signed-transactions) to the `/command` endpoint.  

### Packages

Fluree has several published NPM and Clojars packages that provide helper functions for Fluree cryptography. 

1. The <a href="https://github.com/fluree/fluree-cryptography" target="_blank">`fluree-cryptography`</a> library has a several wrapper functions that generate keys, sign transactions, and sign queries. This library is built on top of the fluree cryptography base library. This is available on NPM as `fluree-cryptography`.

2. The <a href="https://github.com/fluree/fluree-cryptography-base" target="_blank">`fluree-cryptography-base`</a> library has a collection of cryptographic hash, encryption, and other functions. This library was written in Clojurescript and compiled to Javascript. This is available on NPM as `fluree-cryptography-base`.

3. The Clojurescript library, <a href="https://github.com/fluree/fluree.crypto" target="_blank">`fluree.crypto`</a> has all of our base cryptographic functions. You can download it on Clojars, or you can visit the library to see human-readable versions of our cryptographic functions. It is available on Clojars as `fluree.crypto`.

### User Interface

Fluree also has a user interface to help users submit signed queries and transactions.

This can be found in the user interface by navigating to `/flureeql`. By clicking the "sign" button, you can toggle whether or not there is an option to sign queries and transactions. Note that the hosted version of Fluree does not allow you to sign queries, because `fdb-open-api` is set to true for all hosted accounts, so a signed query would be ignored regardless.

### Signed Queries
If `fdb-open-api` is set to true, then you do not need to sign your queries. With an open api, you can still sign your queries to see what the results would have been with a closed API.

If you do need to sign your queries, you should have access to your private key. Your private key needs to be [connected to a valid auth record](/docs/identity/auth-records) in the database.

#### Headers

You should submit a POST request should have the following headers: `content-type`, `mydate`, `digest`, `signature`.

- `content-type`: `application/json`
- `mydate`: An RFC 1123 formatted date, i.e. Mon, 11 Mar 2019 12:23:01 GMT
- `digest`: The SHA2-256 hash of the stringified query body in `base64` encoding, formatted as follows: `SHA-256={hashHere}`
- `signature`: A string containing the algorithm and signature, including other information, formatted as follows: `keyId="na",headers="(request-target) host mydate digest",algorithm="ecdsa-sha256",signature="{sigHere}"`. 

In order to get the actual signature (labelled `sig` above) that goes into the larger signature value, you need to first create a signing string. Formatted as follows: `(request-target): post {uri}\nhost: {host}\nmydate: {formattedDate}\ndigest: SHA-256={digest}`. 

The steps are as follows:

1. Convert the signing string to a byte-array.
2. Convert the private key to a big integer.
3. Hash the result of step 1 with SHA2-256.
4. Sign the hash using the private key using the `SECP256K1` curve (<a href="https://github.com/fluree/fluree.crypto/blob/master/src/fluree/crypto/secp256k1.cljc#L202" target="_blank">example code available on Github</a>).
5. DER encode the results and return the signature using hex-encoding.

#### Body

The body of a signed query is same query as would be submitted in an unsigned query. 

#### Example

```all
 {
      method: 'POST',
      headers: {
                content-type:       application/json,
                mydate:             Thu, 13 Mar 2019 19:24:22 GMT,
                digest:             SHA-256=ujfvlBjQBa9MNHebH8WpQWP7qQO1L+cI+JH//YvWTq4=,
                signature:          keyId="na",headers="(request-target) host mydate digest",algorithm="ecdsa-sha256",signature="1c3046022100da65438f46df2950b3c6cb931a73031a9dee9faaf1ea8d8dd1d83d5ac026635f022100aabe5483c7bd10c3a468fe720d0fbec256fa3e904e16ff9f330ef13f7921700b"
            },
      body: { "select": ["*"], "from": "_collection"}
 }
```

### Signed Transactions
If `fdb-open-api` is set to true, then you do not need to sign your transactions. Each database comes with a default auth record, which is either provided by you or automatically generated (see [config options](/docs/getting-started/installation#config-options)). If `fdb-open-api` is set to true, then all transactions submitted to `/transact` will be signed with this default private key unless otherwise specified. 

All signed transactions need to be submitted to the [`/command` endpoint](/api/downloaded-endpoints/overview). Transactions can be sent to the `/command` endpoint, regardless of whether `fdb-open-api` is true or not. All transactions submitted will be attributed to the auth record that signs the transactions, not the default auth record (if there is one).

The `/command` endpoint takes a map with two keys:

Key | Description
--- | ---
cmd | Stringified command map
sig | ECDSA signature of the cmd key. 

When submitting a transaction, the command map of type `tx` (transaction) needs to have the following keys in the following order. Documentation on command of type `new-db` and `default-key` is forthcoming. 

#### Command Map

Key | Description
--- | ---
type | `tx`, `new-db`, or `default-key`. 
db | `network/dbid`
tx | The body of the transaction
auth | `_auth/id` of the auth
fuel | Max integer for the amount of fuel to use for this transaction
nonce | Integer nonce, to ensure that the command map is unique.
expire | Epoch milliseconds after which point this transaction can no longer be submitted. 

#### Sig

The steps to get a signature are as follows:

1. Convert the stringified command to a byte-array.
2. Convert the private key to a big integer.
3. Hash the result of step 1 with SHA2-256.
4. Sign the hash using the private key using the `SECP256K1` curve (<a href="https://github.com/fluree/fluree.crypto/blob/master/src/fluree/crypto/secp256k1.cljc#L202" target="_blank">example code available on Github</a>).
5. DER encode the results and return the signature using hex-encoding.

### Verifying Signatures

ECDSA allows for recovery of the public key from a signature, so the original transaction and signature are the only two things required in order to verify that a signature is valid. There are online tools that allow you to independently verify a signature based on the signature + original transaction. 

Our `fluree-cryptography-base` and `fluree.crypto` libraries allow for you to check the signature.

### Examples

You can see examples of how to use signed transaction in the [Cryptocurrency](/docs/examples/cryptocurrency), [Voting](/docs/examples/voting), and [Supply Chain](/docs/examples/supply-chain) sample apps. 