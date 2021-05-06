## Smart Functions

Smart functions are the engine for setting permissions in Fluree. This section details the role of smart functions. 

To see a full list of all accepted smart functions, see [smart function list](/docs/schema/functions#universal-functions-for-_fn-code).

We also have a <a href="https://github.com/fluree/smart-function-library" target="_blank">Github repo</a> with basic smart functions you can add to your applications.

For some additional help testing and debugging your smart function implementations, try updating your `logback.xml` configuration file (located in your Fluree directory) so that logging for `fluree.db` is set to `DEBUG`, e.g.

```all
<configuration scan="true">
    ...
    <logger name="fluree.db" level="DEBUG"/>
    ...
</configuration>
```

In this setting, Fluree will log the entirety of the Smart Function Stack, so that every time a query/transaction triggers the evaluation of a smart function, you can observe its invocation, context, and result.

### Role of Smart Functions

Every time a transaction is issued, that transaction might trigger various smart functions. In addition, when an end user issues a query, various smart functions might be triggered. 

Smart functions will either return `true` or `false`. If every smart function that is triggered returns a `true`, then the transaction will go through. If even one triggered smart function returns `false`, then the transaction will fail, or in the case of a query- that piece of information will not be displayed to the user. 

Smart functions are stored in the `_fn` collection. From the `_fn` collection, smart functions can be referenced in a variety of places. Functions stored in different locations are triggered in slightly different ways.

Location | When Trigged?
-- | --
[_rule/fns](/guides/smart-functions/rules) | When an `_auth` record containing a given `_rule` issues a query or transaction containing the `_collection` or `_predicates` specified in the rule. 
[_collection/spec](/guides/smart-functions/collection-spec) | When transaction containing the specified `_collection` is issued, regardless of the issuer.
[_predicate/spec](/guides/smart-functions/predicate-spec) | When transaction containing the specified `_predicate` is issued, regardless of issuer (once per specified predicate).
[_predicate/txSpec](/guides/smart-functions/predicate-tx-spec) | When transaction containing the specified `_predicate` is issued, regardless of who issuer (once per transaction).
[In transactions](/guides/smart-functions/fns-in-txs) | You can use smart functions directly in transactions, but their role and behavior is slightly different. 