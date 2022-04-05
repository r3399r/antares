#!/bin/bash
set -e

env=$1
project=porrima
subDomain=lottery
domain=celestialstudio.net

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

# echo deploy backend AWS...
# aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway
# aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket y-cf-midway
# echo ====================================================================================

echo deploy frontend to S3...
cd ..
npm i
npm run pre:deploy
aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
echo ====================================================================================

if [ $1 = "prod" ]
  then
    echo "do tagging process..."
    cd ..
    version=$(node -pe "require('./package.json').version")
    git config --global user.email "github-actions-bot@github.com"
    git config --global user.name "github-actions-bot"
    git tag -a $version -m "$version"
    git push origin $version
fi