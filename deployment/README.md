# Deployment Process

## Dev environment

Github action would do auto-deployment when any pull request is merged into `dev`.

If one wants to do deployment manually, please run `bash deploy.sh test` with propert configuration.

## Production Release

1. Decide the version number
2. Create new branch from `dev` called `release-*`
3. Change the version in each folder manually
4. Merge release branch to both `master` and `dev`
5. Github action would carry the deployment job when the PR is merged into `master`.

## Database Refresh

After new version release, admin can do a backup from production and restore it with the environment name.
