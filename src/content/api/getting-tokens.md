## Getting Tokens

Tokens are tied to specific accounts, and have access to all databases in those accounts. In previous versions, there were tokens for specific databases. This is no longer the case. 

Tokens are retrieved via the [api/db/signin](/api/hosted-endpoints/hosted-examples#-api-db-signin) endpoint. These tokens give you access to retrieve a list all the databases in an account, as well as full query, transaction, and logs viewing permission for all of the databases in an account. 

### Cryptography

It is worth noting that transactions are signed using public/private key cryptography. The hosted Fluree abstracts this from your application so that a more common username/password authentication scheme can be utilized.

Interacting with the hosted Fluree is done using secure tokens that have the account encoded directly in them. This account is connected to a private key stored by Fluree, in the future, we will support hosted Fluree users to input and manage their own private keys. 

### Revoking Tokens

Tokens become useless when they reach their token expiration date.
