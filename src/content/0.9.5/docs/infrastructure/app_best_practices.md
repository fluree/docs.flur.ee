## Best Practices

In a traditional application, there are three layers:

1. User Interface
2. Business Logic
3. Database

In the case of Fluree, some of the business logic can be located in the database layer.

In a decentralized database, before any given block is committed, the network confirms the validity of the proposed transaction. A transaction is only valid if the syntax is correct, the types (i.e. string, int, long) for each predicate are correct, and all triggered [smart functions](/docs/infrastructure/smart-functions) return true. The exact method that the network reaches an agreed upon shared state is determined by rsch database's [consensus algorithm](/docs/database-setup/database-settings).

Because smart functions restrict what you can transact at the database level, it is important to build up your Fluree application layer-by-layer. Specifically: 

**1. Create a Schema**

Your initial schema should only specify collection and predicates, without any smart functions. 

**2. Add Sample/Initial Data**

The initial data that populates a database may not conform to the rules that will be later added to the database. For example, when initially populating a database, you may give every account an `account/balance` of 100 - 500 points, but later you specify that points cannot be created arbitrarily. 

**3. Create Auth, Roles, and Rules**

Add rules, which govern what each type of user can edit and transact. 

**4. Add Your Smart Functions from Simplest to Most Complicated**

Because smart functions restrict what can be done in a database, and because you can use your custom functions in other custom functions, it makes sense to add your functions in order of complexity. This will allow you to test those functions, and you will be able to use previous functions as building blocks in future functions. 

These best practices are employed in the examples on this site, so you can refer back to these steps to see how they are used. 