## In-Memory Fluree

You can run Fluree in memory for testing purposes. To run Fluree in-memory, you must be running only one single server (not in a transactor group).

To do so, you will need to specify the following config options: 

1. `fdb-consensus-type` as `in-memory` 
2. `fdb-storage-type` as `memory`. 

Full-text indexing and full-text search are not available when running Fluree in-memory. 