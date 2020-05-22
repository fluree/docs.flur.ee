## Schema Overview

Much like a relational database, before storing your records in a Fluree database, you must first register a schema which consists of collections (similar to tables) and predicates (similar to columns).

Defining and updating schemas is done through regular database transactions (in JSON) by writing to the special pre-defined system collections. This also means that all information regarding the schema is stored in the database as [flakes](/docs/infrastructure/db-infrastructure#flakes), in the same way as any other type of information. 

Most examples in the documentation use the [Basic Schema](/docs/getting-started/basic-schema). The Basic Schema section provides an introduction to schema, but this section goes into more detail. 

### Validation
Fluree validates all updates written against the database's schema, ensuring each change meets all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness).

Beyond validating types, Fluree allows custom validation that can further restrict predicate values. This level of validation is done by specifying an optional [spec for a collection](/docs/smart-functions/collection-spec) or [predicate](/docs/smart-functions/predicate-spec).

### References 
Being a graph database, the special type of ref (reference) is core to traversing through data. Any predicate of type ref refers (links/joins) to another entity. These relationships can be navigated in both directions. For example, listing all invoices from a customer record is trivial if the invoice is of type ref, and once established an invoice automatically links back to the customer.

### System Collections

When a new database is created, the first transaction, issued automatically by Fluree, initializes system collections and predicates. 

These system collections govern various database behaviors, such as schema, user rules, smart functions. Each of these system collections and their predicates is discussed in its respective section. The below list compiles all of the built-in collections in one place, and you can follow the link to any particular section for more information.

### All System Collections

All databases are created with the following collections. 

Collection | Description
--- | ---
[_collection](/docs/schema/collections) | Schema collections list
[_predicate](/docs/schema/predicates) | Schema predicate definition
[_tag](#_tag) | Tags
[_fn](#_fn) | Database functions
[_user](#_user) | Database users
[_auth](#_auth) | Auth records. Every db interaction is performed by an auth record which governs permissions.
[_role](#_role) | Roles group multiple permission rules to an assignable category, like 'employee', 'customer'.
[_rule](#_rule) | Permission rules
[_block](#_block) | Block metadata
[_tx](#_block) | Database transactions
[_setting](#setting) | Database settings