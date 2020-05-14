## Smart Functions

Smart functions are the engine for setting permissions in Fluree. This section details the role of smart functions. 

To see a full list of all accepted smart functions, see [smart function list](/docs/schema/smart-functions).

We also have a <a href="https://github.com/fluree/smart-function-library" target="_blank">Github repo</a> with basic smart functions you can add to your applications.

### Role of Smart Functions

Every time a transaction is issued, that transaction might trigger various smart functions. In addition, when an end user issues a query, various smart functions might be triggered. 

Smart functions will either return `true` or `false`. If every smart function that is triggered returns a `true`, then the transaction will go through. If even one triggered smart function returns `false`, then the transaction will fail, or in the case of a query- that piece of information will not be displayed to the user. 

Smart functions are stored in the `_fn` collection. From the `_fn` collection, smart functions can be referenced in a variety of places. Functions stored in different locations are triggered in slightly different ways.

Location | When Trigged?
-- | --
[_rule/fns](/docs/smart-functions/rules) | When an `_auth` record containing a given `_rule` issues a query or transaction containing the `_collection` or `_predicates` specified in the rule. 
[_collection/spec](/docs/smart-functions/collection-spec) | When transaction containing the specified `_collection` is issued, regardless of the issuer.
[_predicate/spec](/docs/smart-functions/predicate-spec) | When transaction containing the specified `_predicate` is issued, regardless of issuer (once per specified predicate).
[_predicate/txSpec](/docs/smart-functions/predicate-tx-spec) | When transaction containing the specified `_predicate` is issued, regardless of who issuer (once per transaction).
[In transactions](/docs/smart-functions/fns-in-txs) | You can use smart functions directly in transactions, but their role and behavior is slightly different. 

### Function Predicates

There are two built-in smart functions that come with every database, `["_fn/name", true]` and `["_fn/name", false]`, which simply return `true` or `false`, respectively. Below are all of the predicates that you can specify when creating a smart function.

Predicate | Type | Description
-- | -- | -- 
`name` | `string` | Function name
`params` | `(multi) string` | List of parameters this function supports.
`code` | `string` | Actual database code
`doc` | `string` | A docstring for this function.
`language` | `string` |  Programming language used (not yet implemented, currently only Clojure supported)
`spec` | `JSON` | (not yet implemented) Optional spec for parameters. Spec should be structured as a map, parameter names are keys and the respective spec is the value.s