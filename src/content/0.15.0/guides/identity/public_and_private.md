## Public and Private Keys

In Fluree, identity is established through 256 bit public and private key pairs. Auth ids can be derived from those public keys. When a transaction is issued and signed, it is not acceptable unless the transaction is signed by a private key that corresponds to an auth id already in the database.

Fluree uses the Elliptic Curve Digital Signature Algorithm (ECDSA), specifically the [`secp256k1` curve](http://www.secg.org/sec2-v2.pdf), with [Base58Check encoding](https://en.bitcoin.it/wiki/Base58Check_encoding#Background). If you are unfamiliar with public and private keys, we highly recommend the [lesson on Cryptography](/lesson/im-cryptography/1), which explains public-key cryptography basics, as well as how Fluree, specifically, uses these techniques.

### Generating a Public-Private Key/Auth Id Triple

There are many ways to generate valid public-private key/auth id triple:

1. In the downloadable version of Fluree, you can run the following command to generate a public key, private key, and auth id. `./fluree_start.sh :keygen`
2. In the user interface, in either the hosted or the downloadable version, you can go to Permissions and View Permissions by Auth. From there, you can click, "Generate Keys" to generate valid keys. You can also do so from FlureeQL -> Transact.
3. The <a href="https://github.com/fluree/crypto-utils" target="_blank">`@fluree/crypto-utils`</a> library has a `generateKeyPair` function that will generate a `public` and `private` key pair. `getSinFromPublicKey` will return an account id given a public key. This library is available on <a href="https://www.npmjs.com/package/@fluree/crypto-utils" target="_blank">npm</a>.
4. The <a href="https://github.com/fluree/crypto-base" target="_blank">`@fluree/crypto-base`</a> library has a `generate_key_pair` function that will generate a `public` and `private` key pair. `account_id_from_private` or `account_id_from_public` will return an account id given a private or public key, respectively. This library is available on <a href="https://www.npmjs.com/package/@fluree/crypto-base" target="_blank">npm</a>.
5. The Clojurescript library, `fluree.crypto` has a function `generate-key-pair`, `account-id-from-private`, and `account-id-from-public` that return a public and private key, as well as an account id. This library is available on <a href="https://clojars.org/fluree.crypto" target="_blank">clojars</a>, and the code is on <a href="https://github.com/fluree/fluree.crypto" target="_blank">GitHub</a>.

### Auth Id