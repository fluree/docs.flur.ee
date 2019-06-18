## Auth Records

Auth records control identity in Fluree and can be tied to specific public-private key pairs. 
As mentioned in the previous section, once you have a public-private key-pair, you can generate an auth id by hashing the public key with SHA3-256 and then RIPEMD-160. You then need to add this auth id to the database. If it is not added to the database, any transactions signed with the relevant private key are invalid.

Adding a new auth to the database, with an id derived from the public key:

```all
[{
    "_id": "_auth",
    "id": "kh90sdlsdmyFakeAuthId",
    "doc": "My temporary auth record"
}]
```

Any roles that you add to this auth record set permissions for transactions that are signed with this auth record. 

Note: This is not necessary if `fdb-api-open` is set to true (which is the default in the downloadable version). 

### Authority

Authority is a feature of Fluree that allows one entity, an authority, to act on behalf of another entity, an auth. This feature adds convenience at the expense of security, and should only be used if this trade-off is well understood. 

Any given transaction can be signed by the `_auth` issuing that transaction (if they have a private key), or by another `_auth` that is listed in the original auth record's `_auth/authority`. 

For example, we might have two parties: the IT Team and Alba. The IT team has a public-private key pair, but employees do not. Rather than make employees keep track of (and secure) a private key, employees might just use a username and password. The IT Team's public-private key pair is below. 

```all
IT Team

Auth Id:                Tf5q9TVMoJ2MSATxN5XhAizBMSBEUGuy8aU
Public Key:             023f5b5873e70988dcc91cef76e13402888a0d51c8d68eea6976a8b0fab4a05c43
Private Key:            a12f89d64f966d431ea4fff850baf01f501438ccea53b6f6bb041e9eed559a76
```

To test this out, we can add two auth records:

```all
[{
    "_id": "_auth$IT",
    "id": "Tf5q9TVMoJ2MSATxN5XhAizBMSBEUGuy8aU",
    "doc": "IT Team's auth",
    "roles": [[ "_role/id", "root" ]]
},
{
    "_id": "_auth",
    "id": "Alba",
    "doc": "Alba's auth",
    "authority": ["_auth$IT"],
    "roles": [[ "_role/id", "root" ]]
}]
```

Now, let's say Alba wants to issue a transaction creating a new person. She cannot sign her own transaction, because she does not have a private key. However, she can send transaction to the IT Team, who can sign it for her. 

The IT Team (the authority in this case) has to verify whether or not the person who sent them is, in fact, Alba. Fluree does not control how or whether you do this. The IT Team may have an app that uses a username/password schema for authentication, they can require Alba to write her transaction on a piece of paper and hand deliver it to IT. From Fluree's perspective, it doesn't matter. The IT Team then can issue Alba's transaction (for example `[{"_id": "person", "handle": "aJohnson", "fullName": "Aimee Johnson" }]`) signed with the following information (you can sign a transaction using the UI by selecting `Transact` and `Sign`).


```all
Auth Record:    Alba
Private Key:    a12f89d64f966d431ea4fff850baf01f501438ccea53b6f6bb041e9eed559a76

[{
    "_id": "person", 
    "handle": "aJohnson", 
    "fullName": "Aimee Johnson" 
}]
```

Additionally, the rules that apply to whether the above transaction is valid is based on the rules attached to issuing auth record (Alba, in this case), and NOT to the rules issued to the authority (the IT team). 

Furthermore, there is no proof, other than the Authority's protocols that the person who issued the transactions is who they say they are. 

Authorities can be a very useful tool to allow users of Fluree to issue transactions without maintaining private keys, but this approach is less secure and does not provide cryptographic proof that a particular individual issued a given transaction. There is, however, a record of when a transaction is issued by an authority in the `_tx/authority` predicate.
