## Deleting a Ledger

Deleting a ledger means that a user will no longer be able to query or transact against that ledger, but currently the actual ledger files will not be deleted on disk. You can choose to delete those files yourself - or keep them. You will not be able to create a new ledger with the same name as the deleted ledger.

Currently, you can only delete a ledger if you are using Fluree version 0.11.0 or higher and you are using the downloaded version of Fluree. In addition, there is currently no way to delete a ledger via the UI. You must use the [API](/api/downloaded-endpoints/downloaded-examples#-delete-db) to delete a ledger.