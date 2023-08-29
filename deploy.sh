#!/bin/bash
set -e

env=$1
project=antares
subDomain=lottery
domain=celestialstudio.net

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

echo deploy AWS...
aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway-singapore
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket y-cf-midway-singapore --capabilities CAPABILITY_NAMED_IAM
echo ====================================================================================

echo prepare list...
cd ./crawler
node index.js

echo deploy frontend to S3...
cd ../frontend
npm i
npm run build
aws s3 sync ./out s3://$project-$env-y --delete --cache-control no-cache
echo ====================================================================================
