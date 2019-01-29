## Overview

Hosted endpoints can only be used in the hosted versions of FlureeDB. All requests should be POST requests. The signed endpoints are below, and they are all structured as follows:

`https://[ACCOUNTNAME].beta.flur.ee/[ENDPOINT]`.

These endpoints are NOT available in the downloadable version.

Action | Endpoint | Explanation 
-- | -- | --
Query | `/api/db/query` | Queries in FlureeQL syntax
Multi-Query | `/api/db/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/api/db/block` | Block queries in FlureeQL syntax
History |  `/api/db/history`| History queries in FlureeQL syntax
Transact | `/api/db/transact` | Transactions in FlureeQL syntax
GraphQL | `/api/db/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/api/db/sparql` | Queries in SPARQL syntax, as a string
Token | `/api/db/token` | Retrieve a token for a given database. Syntax in [Getting Tokens](/api/hosted-endpoints/getting-tokens) and [Examples](/api/hosted-endpoints/hosted-examples)
Logs | `/api/action` | Retrieve the logs for a given database. Syntax in [Examples](/api/hosted-endpoints/hosted-examples)
Signin | `/api/signin` | Retrieve a token for your account for the master database. Syntax in [Getting Tokens](/api/hosted-endpoints/getting-tokens) and [Examples](/api/hosted-endpoints/hosted-examples)

Requests to all of the above endpoints require you to provide a token in the header, with the exception of `/api/signin`. See [Getting Tokens](/api/hosted-endpoints/getting-tokens) to find out how to get the correct token.