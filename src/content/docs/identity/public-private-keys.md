## Public and Private Keys

In Fluree, identity is established through 256 bit public and private key pairs. Auth ids can be derived from those public keys. When a transaction is issued and signed, it is not acceptable unless the transaction is signed by a private key that corresponds to an auth id already in the database. 

Fluree uses the Elliptic Curve Digital Signature Algorithm (ECDSA), specifically the [`secp256k1` curve](http://www.secg.org/sec2-v2.pdf), with [Base58Check encoding](https://en.bitcoin.it/wiki/Base58Check_encoding#Background). 

ECDSA keys are used by most blockchains, including Ethereum and Bitcoin, and are preferable to RSA (Rivest-Shamir-Adleman) keys, because 256 bit ECDSA keys are as secure as 3072 bit RSA keys. 

### Generating a Public-Private Key/Auth Id Triple

There are many ways to generate a public-private key/auth id triple:

1. In the downloadable version of Fluree, you can run the following command to generate a public key, private key, and auth id. `./fluree_start.sh :keygen`
2. In the user interface, in either the hosted or the downloadable version, you can go to Permissions and View Permissions by Auth. From there, you can click, "Generate Keys" to generate valid keys. You can also do so from FlureeQL -> Transact. 
3. We provide Javascript functions to generate these triples in the <a href="https://github.com/fluree/cryptography" target="_blank">cryptography repo</a>.

### Intro to Public-Private Keys

A user's private key should never be shared with anyone. The private key is used to sign transactions (and queries, depending on your network configuration). The corresponding public key, the original transaction, and the signature are all publically available to the network, and these pieces of information can be used to verify that only the person that possesses the relevant private key could have issued and signed a given transaction.

If you are unfamiliar with public and private keys, we highly recommend the [lesson on Cryptography](/lesson/im-cryptography/1), which explains public-key cryptography basics, as well as how Fluree, specifically, uses these techniques. 

### Features of the secp256k1 Curve

In order to generate a public-private key-pair, you need to start with a private key. That key is inputted into the curve, and returns a public key. Private keys for secp256k1 are 256 bits, or 8 bytes. Almost any string of 256 ones and zeroes is valid as a private key with some exceptions:

- The number must be  positive.
- The number must be less than `FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141` (approximately 2<sup>256</sup>).

In addition, because the secp256k1 curve is the same curve that Bitcoin uses, it is both well-understood, highly tested, and there are a great deal of resources about this curve available online. When starting a Fluree network for the first time (downloadable version), a default private key is automatically generated.

### Base58Check Encoding

The public-private key pairs generated from Elliptic Curve Cryptography are zeroes and ones (binary). However, rather than working with long binary numbers, we use Base58Check encoding to turn those zeroes and ones to a shorter, alphanumeric string. 

Base58Check encoding is the same encoding used in Bitcoin, and was developed by the creator of Bitcoin, Satoshi Nakamato. Compared to Base64, Base58 omits similar-looking letters, such as 0, O, I, and l. 

### Auth Id

Once you have a public-private key-pair, you can generate an auth id by hashing the public key with SHA3-256 and then RIPEMD-160. An auth record with this id needs to be in the database in order for a transaction signed with the corresponding private key to be valid.

### Default Private Key

Every node of Fluree can either specify a private key or private key file location (as [configured at start-up](/docs/getting-started/installation#config-option)). If neither is specified, a `default-private-key.txt` file will be created when an instance of Fluree starts up for the first time, and an assocatied auth record that corresponds to the private key will be added to the master database with root access. 

If `fdb-api-open`, anyone can issue a query without signing it, and unsigned transactions will be signed with the default private key. 