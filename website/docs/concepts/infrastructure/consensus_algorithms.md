# Consensus Algorithms

Consensus algorithms decide how new blocks are committed to a chain, as well as
who can commit those blocks. Consensus algorithms have to balance the need for speed
with the need for security. The choice of consensus algorithm depends on your use
case, and whether your network is more or less trusted.

Currently, Fluree supports the Raft consensus algorithm. The next algorithm we will
release is the PBFT (Practical Byzantine Fault Tolerance) algorithm. The consensus
algorithm you use is specified in the `fdb-consensus-type` config setting (look
at [config settings](/overview/start/fluree_anywhere.md#config-options) for more
information).

## Raft {#raft}

[Raft](https://raft.github.io/raft.pdf) is a consensus algorithm that is designed
to be easy to understand. Raft is well-suited for networks that are more trusted,
and it is faster than PBFT.

- Fault tolerance: `2n + 1` servers required, where `n` is a faulty server
- In Raft, a leader is elected, and that leader commits blocks until they become
- unresponsive for a period of time.  

Resources:

- [Raft paper](https://raft.github.io/raft.pdf)
- [Github Pages for Raft](https://raft.github.io/) for visualizations and links
  to more resources.

## PBFT {#pbft}

[Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf)
(PBFT) is a Byzantine fault tolerant algorithm designed for asnychronous environments
(like a Fluree network or the internet).

- Fault tolerance: `3n + 1` servers required, where `n` is a faulty server
- PBFT also uses leader-election, and the leader is replaced in each transaction,
  or if an existing leader is unresponsive for a period of time.

Resources:

- [PBFT paper](http://pmg.csail.mit.edu/papers/osdi99.pdf)
