# Steps to run and update Algolia Index

1. Rename this file to algolia.env
2. Insert the API_KEY and APPLICATION_ID from Algolia below
3. Remove instructions
4. Install [jq](https://stedolan.github.io/jq/download/)
5. From the root directory of this repo run:

```bash
   docker run -it --env-file=./algolia.env -e "CONFIG=$(cat ./algolia.config.json | jq -r tostring)" algolia/docsearch-scraper
```

API_KEY=<search api key>
APPLICATION_ID=<app id>
