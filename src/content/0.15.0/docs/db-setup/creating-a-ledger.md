## Creating a Ledger

When creating a new ledger, you must specify a `db/id`. This id must be unique in your network and cannot be changed. A `db/id` begins with your network name followed by `/`. 

A ledger name is comprised of a network name followed by the ledger name `network/db`. Both the network name and the ledger name can only include lowercase characters, numbers, and dashes - `[a-z0-9-]`. This ensures cross-platform file and URL-compatibility. ledger created with previous versions where uppercase letters were allowed will be automatically lowercased, as of version 0.11.0 and up.

If a network already exists with that name, and you have permissions to add to that network, a new ledger will be created. If a network does not already exist with that name, a new network and new ledger will be created. 

You can either create a new ledger through the user interface, through the API for the [downloadable version](/api/downloaded-endpoints/downloaded-examples#-new-db), or through the API for the [hosted version](/api/hosted-endpoints). 

You can also create a new ledger from a snapshot file (see [snapshotting](/docs/ledger-setup/snapshotting-a-ledger)).

When a ledger is created, it automatically has all of the system collections, as well as an `auth/id` which is tied to a private key. In the hosted version, this key is kept by Fluree (user-controlled private keys to be added shortly). In the downloadable version, this private key is held in `default-private-key.txt` (unless specified otherwise in your properties file).
