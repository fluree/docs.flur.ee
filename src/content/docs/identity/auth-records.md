## Auth Records

Auth records control identity in FlureeDB and can be tied to specific public-private key pairs. 
As mentioned in the previous section, once you have a public-private key-pair, you can generate an auth id by hashing the public key with SHA3-256 and then RIPEMD-160. You then need to add this auth id to the database. If it is not added to the database, any transactions signed with the relevant public key are invalid.

Adding a new auth to the database, with an id derived from the public key:

```all
[{
    "_id": "_auth",
    "id": "kh90sdlsdmyFakeAuthId",
    "doc": "My temporary auth record"
}]
```

Note: This is not necessary if `fdb-group-open-api` is set to true (which is the default in the downloadable version). 

### Authority

Authority is a feature of FlureeDB that allows one entity, an authority, to act on behalf of another entity, an auth. This feature adds convenience at the expense of security, and should only be used if this trade-off is well understood. 

Any given transaction can be signed by the `_auth` issuing that transaction (if they have a private key), or by another `_auth` that is listed in the original auth record's `_auth/authority`. 

For example, a company may only want their IT team to have private keys. All other employees in the company can still transact with FlureeDB, but they do not have their own private keys. 

Let's say an employee, Alba, in the Finance Department want to issue a transaction. The IT team would first have to create an `_auth` for Alba and add the IT Team's auth record to the Alba's `_auth/authority`. 

```all
[{
    "_id": "_auth",
    "id": "alba",
    "doc": "Alba's auth record",
    "authority": ["_auth/id", "lpij34gfdjkdfg"]         // The IT team's auth id. 
}]
```

Now, when Alba wants to issue a transaction, she may send the following transaction to the IT Team:

```all
[{
    "_id": "invoice",
    "name": "my_invoice",
    "amount": 140
},
{
    "_id": "_tx",
    "auth": ["_auth/id", "alba"]
}]
```

The transaction contains the relevant auth record, `["_auth/id", "alba"]`, that is issuing this transaction, but Alba does not have a private key and is not providing a signature to the IT team. It is the IT team's job to make sure that it is, in fact, Alba who is issuing the transaction. The IT team could do this by asking Alba face-to-face or by making sure that only Alba could have sent them the above transaction (i.e. through an interface accessible through username and password). How (and whether) they determine that Alba is really the one issuing the transaction is up to the IT Team (the authority in this case). 

Additionally, the rules that apply to whether the above transaction is valid is based on the rules attached to issuing auth record (Alba, in this case), and NOT to the rules issued to the authority (the IT team). 

Furthermore, there is no proof, other than the Authority's protocols that the person who issued the transactions is who they say they are. 

Authorities can be a very useful tool to allow users of FlureeDB to issue transactions without maintaining private keys, but this approach is less secure and does not provide cryptographic proof that a particular individual issued a given transaction.
