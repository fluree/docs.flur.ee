## Schema Overview

Much like a relational database, before storing your records in a Fluree database, you must first register a schema which consists of collections (similar to tables) and predicates (similar to columns).

Defining and updating schemas is done through regular database transactions (in JSON) by writing to the special pre-defined system collections. This also means that all information regarding the schema is stored in the database as [flakes](/docs/infrastructure/db-infrastructure#flakes), in the same way as any other type of information. 

Most examples in the documentation use the [Basic Schema](/docs/getting-started/basic-schema). The Basic Schema section provides an introduction to schema, but this section goes into more detail. 

### Validation
Fluree validates all updates written against the database's schema, ensuring each change meets all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness).

Fluree predicates can be of many different types documented in the [types table](/docs/infrastructure/system-collections#_predicate-types) (i.e. string, boolean). 

Beyond validating types, Fluree allows custom validation that can further restrict predicate values. This level of validation is done by specifying an optional [spec for a collection](/docs/smart-functions/collection-spec) or [predicate](/docs/smart-functions/predicate-spec).

### References 
Being a graph database, the special type of ref (reference) is core to traversing through data. Any predicate of type ref refers (links/joins) to another entity. These relationships can be navigated in both directions. For example, listing all invoices from a customer record is trivial if the invoice is of type ref, and once established an invoice automatically links back to the customer.


