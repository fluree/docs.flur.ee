## Database Settings

Every database contains a built-in `_db` collection that defines several database configurations. You can change these accordingly.

Key | Description
---|---
`txMax` | Maximum transaction size in bytes. Will default to the network db's value if not present.
`transactors` | Reference to auth identities that are allowed to act as transactors/miners for this database.
`anonymous` | Reference to auth identity to use for anonymous requests to this db.