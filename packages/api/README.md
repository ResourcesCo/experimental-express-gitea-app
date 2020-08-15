# API

## Creating the first superadmin user

There is a signup code stored in the environment variable `SIGNUP_CODE`.
This is required when `SIGNUP_OPEN` is false, which is the default, and
should be left false until the first superadmin is added.

To sign up, go to this URL in the frontend app and sign up:

`/signup/<signup_code>`

Then go into the database and get the user, and change `is_active` to
`true` (or `1`) and and `role` to `superadmin`.
