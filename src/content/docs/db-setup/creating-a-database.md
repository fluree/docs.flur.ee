## Creating a Database

When creating a new database, you must specify a `db/id`. This id must be unique in your network and cannot be changed. A `db/id` begins with your network name followed by `/`. If a network already exists with that name, and you have permissions to add to that network, a new database will be created. 

If a network does not already exist with that name, a new network and new database will be created. You can either create a new database through the [user interface](/docs/getting-started/user-interface#account-page), through the API for the [downloadable version](/api/downloaded-endpoints/downloaded-examples#-new-db), or through the API for the [hosted version](/api/hosted-endpoints/hosted-examples#-api-action-new-database). 

When a datbaase is created, it automatically has all of the system collections, as well as an `auth/id` which is tied to a private key. In the hosted version, this key is kept by Fluree (user-controlled private keys to be added shortly). In the downloadable version, this private key is held in `default-private-key.txt` (unless specified otherwise in your properties file).
