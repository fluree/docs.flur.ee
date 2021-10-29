# About Fluree

## How Fluree Works {#how-fluree-works}

Fluree is an immutable graph database that, beyond performing typical modern database functions, emphasizes security, trust, provenance, privacy, and interoperability. Fluree is open source, under the AGPL license, and built on open standards. Fluree can be run centralized, distributed, or decentralized.

### Built on Open Standards {#open-standards}

Fluree is an immutable RDF graph database built on Clojure and W3C standards. The Fluree system natively supports JSON and JSON-LD and can leverage/enforce any RDF ontology ( including vocabulary standards from schema.org or bring-your-own schemas).

### Scalable, Cloud-Native Architecture {#cloud-native-arch}

Fluree’s technology runs on a simple and lightweight java runtime for easy deployment across on-premises and cloud. The system is comprised of a ledger and a graph database.

### Data-Centric Ideology {#data-centric}

Fluree’s components and features are influenced by the “Data-Centric” ideology - the belief that data is recyclable, versatile, and valuable asset that should exist independently of a singular application and can empower a broad range of stakeholders.

### Immutable Ledger (State Management) {#immutable-ledger}

Fluree accepts and persists transactions in an immutable (append-only) ledger. The ledger records atomic updates in chronological order and secures them using cryptography - making all data, including metadata, timestamps, and identities related to data completely reproducible and verifiable. One can optionally decentralize the ledger system to a democratic network via RAFT or PBFT consensus mechanisms.

### Graph Database (Indexing and Querying) {#graph-db}

Fluree indexes ledger updates into a rich RDF graph database, capable of basic and advanced queries as well as semantic inferencing. Fluree exposes a variety of query interfaces: GraphQL, SPARQL, SQL, and JSON-based FlureeQL. Multi-modal data access allows data consumers to query data in the language of their choice and in the shape and format of their particular needs.

### Smart Functions {#smart-functions}

The Fluree system consists of a cryptographically-secure ledger to handle state and a scalable semantic graph database to serve queries. Fluree uses SmartFunctions, smart and flexible embedded data policies similar to stored procedures, to enforce rules related to identity and access management as well as data shape and quality.

## More Resources {#more-resources}

There are other resources in this documentation website, such as:

- [Technical Overview](/concepts/technical_overview.md): An explanatory document about the main
  components in Fluree.
- [Guides and Lessons](/guides/guides.mdx): Walkthroughs and How-to's of important areas of Fluree.
- [Reference](/reference/reference.mdx): Reference docs for our Javascript, NodeJS, FlureeWorker, and
  other libraries.
- [Concepts](/concepts/concepts.mdx): Discussions of key concepts in Fluree.

To get started, work through the steps in this [to-do list generator](https://github.com/fluree/to-do-lists-generator)
repo for an introduction to integrating Fluree in a React application.

## Where Can I Get Help? {#get-help}

If you can't find the answers you are looking for in our documentation, please
let us know! We are always looking to improve the quality of support we provide.

You can [post to our Github Discussions](https://github.com/fluree/db/discussions) to ask questions
of the community, [join our Slack](https://launchpass.com/flureedb), or send an email to
[support@flur.ee](mailto:support@flur.ee).
