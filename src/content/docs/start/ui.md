## User Interface

If you are using the hosted version of Fluree, the interface is located at <https://flureedb.flur.ee>. 

In the downloaded version, the interface is at `http://localhost:[PORT]`. If you did not change your port configuration, this will be port <http://localhost:8080>.

Note: There are slight differences in the appearance in the user interface depending on which version you are using. 

### Log-In 

On the hosted version of Fluree or in earlier downloadable versions of Fluree, you will first have to log in first. There is an option to reset your password if needed.

If your email is attached to more than one account, you will be asked to choose the relevant account. You can always switch accounts by logging out and in again. 

<p class="text-center">
    <img style="height: 190px; width: 250px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/switchAccounts.png" alt="A Circle with an L inside of it. A form underneath the circle has links to: `Account Info`, `Switch Accounts`, and `Logout`">
</p>

### Configure

In downloadable versions of Fluree, there is no built-in username and password. When you go to the interface, you will need to specify a network and IP address.

You can also select whether there is an open API or not (if not, you'll be asked to put in a default private key).

<p class="text-center">
<img  style="height: 400px; width: 650px"  src="https://s3.amazonaws.com/fluree-docs/config_options.png" alt="Form with the heading, 'Config Settings', and three fields: 'network', 'Open API?', and 'Default Private Key'.">
</p>


### Account Page
The account page lists all the databases in your account. You have the option to add and delete databases from this page. 

In the hosted version and older downloadable versions, you will also be able to see all the users in your account, as well as to add, and remove users. 

When you create a new database or new user, you may have to refresh the UI in order to have those database or users appear in the sidebar. 

### Sidebar
In the sidebar, you can select the database you want to use. Earlier downloadable versions of Fluree also allow you to select a particular user. 

Use the sidebar to navigate to different pages in user interface. 

<p class="text-center">
    <img style="height: 190px; width: 170px" src="https://s3.amazonaws.com/fluree-docs/sidebar2.png" alt="Sidebar with links to Account Info, default (a database name), root (a user name), FlureeQL, GraphQL, Schema, Stats, Permissions, and Docs.">
</p>

### FlureeQL

The FlureeQL page allows you to issue FlureeQL style queries and transactions. Note that you need to specify whether you are issuing a query or transaction. In later versions of Fluree, you will also need to specify the type of query. 

In later versions of the UI, you will have the option to sign your transactions as different auth records.

In addition, you can toggle the 'History' to view previously issued queries and transactions. 

<p class="text-center">
    <img style="height: 200px; width: 850px" src="https://s3.amazonaws.com/fluree-docs/flureeql2.png" alt="The top bar has a button that toggles between 'Query' and 'Transact'. The top bar also has a 'Prettify' and 'History' button. There is a 'History' sidebar, and two main sections, one entitled 'Transaction' and the other, 'Results'.">
</p>

### GraphQL
The GraphQL page allows you to issue GraphQL style queries and transactions. In order to include a variable, you can click on the "Query Variables" bar on the bottom left of the interface. 

Like on the FlureeQL page, you can "Prettify" your queries and toggle the "History" sidebar. You can also click, "Docs" to see the different options to GraphQL queries. 

<p class="text-center">
    <img style="height: 200px; width: 850px" src="https://s3.amazonaws.com/fluree-docs/graphql2.png" alt="The top bar has play, 'Prettify', 'History', and 'Docs' buttons. There is a 'History' sidebar, and two main sections, with a 'Welcome to GraphQL' message, and other is blank.">
</p>


### SPARQL
Note: Earlier versions will not have a SPARQL page. 

SPARQL is strictly a query language, so you can only issue queries. On the SPARQL page, you can issue queries and toggle history. 

<p class="text-center">
    <img style="height: 200px; width: 850px" src="https://s3.amazonaws.com/fluree-docs/sparql.png" alt="The top bar has play and 'History' buttons. There is a 'History' sidebar, and two main sections, one for 'SparQL Query' and the other for 'Results'.">
</p>


### Schema
In earlier versions, the Schema page is broken into two parts: 'Explore' and 'Export'. In later versions, these two pages are combined. 

The Schema page shows you all the non-system collections and predicates in your database. There is also a section called, "Export Transaction." If you want to export your schema from one database to another, you can issue the transaction in "Export Schema." This transaction includes all collections, predicates, and functions. 

The Schema Explorer (accessible by either the 'Explore Schema' page or the 'Launch Schema Explorer' button), shows you the GraphQL Voyager tool. This tool displays all the collections and predicates in your schema. Note that if you do not have a valid schema, this will not display. In addition, this outside GraphQL Explorer tool requires all predicates of type, 'ref' to be restricted to a specific collection. This is not required for Fluree in general, but it is required if you want to use the Voyager tool. 

<p class="text-center">
    <img style="height: 300px; width: 850px" src="https://s3.amazonaws.com/fluree-docs/schema2.png" alt="Export Schema page, as described in this section.">
</p>

### Permissions

The Permissions page allows you to view, add, edit, and delete all the users, auth records, roles, and rules in a given database. After you make changes to a given form, the changes will appear in the transaction section below. You can also edit the transaction directly. 

<p class="text-center">
    <img style="height: 300px; width: 850px" src="https://s3.amazonaws.com/fluree-docs/permissions.png" alt="Top of the permission page, which shows you the number of users, auth records, roles, and rules in your database.">
</p>

### Docs

If you click on 'Docs' in the user interface, it will open the Fluree Docs in a new tab. 