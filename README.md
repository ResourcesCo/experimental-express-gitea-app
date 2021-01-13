# app

[![pipeline status](https://gitlab.com/ResourcesCo/app/badges/main/pipeline.svg)](https://gitlab.com/ResourcesCo/app/-/pipelines)

This is an app with a gitea backend for making API requests and database
queries.

It creates gitea users for each user who signs in with an OAuth provider.
Each project is a gitea repository. The gitea permission model is used to
provide access to other users.

## Setting up gitea

TODO: link to a guide to setting up gitea

## Creating the admin user in gitea

Create an admin user in gitea. This will have the permissions needed to
create gitea accounts for the following users.

## Signing in as the admin user

Set the `GITEA_ADMIN_USERNAME` environment variable to the gitea user's
username. Start the app, and click Sign In With Gitea. Sign in with the
Gitea admin user. If it matches the `GITEA_ADMIN_USERNAME`, it will use
that token to create Gitea accounts for other users who sign in.