#!/bin/bash

npm run build

aws s3 sync build/ s3://docs.flur.ee/ --cache-control max-age=300 --delete --profile fluree


