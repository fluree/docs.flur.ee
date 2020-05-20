## Running a Transactor Group

### Setting Up a Transactor Group
Currently, transactor groups only support the Raft consensus algorithm to agree on a shared state for a network of databases. With Raft, a total of `n` servers can support `f` failures: n = 2f + 1. This means that anything less than 3 servers can sustain no failures, 5 servers can sustain two failures. 

You can test a decentralized Fluree on a single computer (different ports) or on multiple computers. Each member of Fluree needs to have its own folder containing `fluree_server.jar`, `fluree_sample.properties`, and `fluree_start.sh`. 

Before starting any of the servers, make sure to set `fdb-group-servers` and `fdb-group-this-server`.

All the members of the transactor group need to have the same `fdb-group-servers`. All of the servers participating in ledger-group should be listed in the format of server-id@host:port, for example to run them all on one machine, you would list:

`fdb-group-servers=myserver1@localhost:9790,myserver2@localhost:9791,myserver3@localhost:9792`

Each server should have a different `fdb-group-this-server`, which should be the server-id (from `fdb-group-servers`). 

Other configuration options that are relevant to setting up a transactor group are:

`fdb-group-timeout`, `fdb-group-heartbeat`, `fdb-group-log-directory`, `fdb-group-snapshot-threshhold`, `fdb-group-log-history`.

See the full explanation for those settings in [config options](#config-options).

### Dynamic Config changes