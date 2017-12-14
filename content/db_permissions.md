# Permissions

## Fluree Permissions

Fluree allows very granular permissions to control exactly what data users can write and read, down to an entity + attribute level. When a user connects to a database, effectively their database is custom to them (and their requested point in time). Any data they do not have access to doesn't exist in their database. This means you can give direct access to the database to any user, and they can run ad-hoc queries without ever a concern that data might be leaked. This is a very powerful concept that can drastically simplify end-user applications.






Permissions are controlled by restricting (or allowing) access to either streams or attributes, and both of these dimensions of access must be true to allow access.

Permissions are assigned to a role, and roles assigned to users. Every action in FlureeDB is always performed as a user and will apply that user's permission to the respective action.

By default, users are disallowed access to all streams and allowed access to all attributes. This has the effect of not allowing a user access to anything, as both these access dimensions must allow access for anything to be seen/transacted.

### Query / Read

Every database that a query is executed against in Fluree can be thought of as a unique, custom database. This applies not only for historical (time travel) queries, but also the same concept applies for permissions. Effectively, every piece of data the user does not have access to does not exist in their database. This allows you to query at will.

When a query asks for attributes or entities that don't exist for them, the results are simply empty. An exception is not thrown in this case.


When reading, any data the user does not have access to see simply disappears, as though it never existed.

### Transact / Write

When transacting, any attempts to transact data that the user does not have permission to write will throw an exception.
It is entirely possible to have write access to data, but not read access.

Block stream can always be written, if permissions on certain metadata are desired the respective attributes must be excluded.



