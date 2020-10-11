# Resources.co API

## Tools

The following tools are needed to build and run the API. For an example of how to
install them, see `.gitlab-ci` in the root of the repo.

This API is a hybrid Golang/Node project. The following go tools are used
in development and/or production. They can be installed by grabbing a binary
or using `go`.

- [krakend](https://www.krakend.io/)
- [caddy](https://caddyserver.com/)
- [reflex](https://github.com/cespare/reflex)
- [migrate](https://github.com/golang-migrate/migrate)
- [gojq](https://github.com/itchyny/gojq)

Maven is also used to run Java to generate the JSON Web Keys for Krakend,
so it can sign and verify JWTs:

- [Apache Maven](https://maven.apache.org/)

## Configuration

The configuration is stored in `env.json` and accessed by the using `gojq`

## Generating JSON Web Keys

To generate the JSON web keys, run these commands:

- `cd jwk/make-jwk`
- `mvn install`
- `mvn compile exec:java -Dexec.mainClass=co.resources.makejwt.MakeRsaJwt`

The key sets will be placed in `jwt` and served in the API

## Running the migrations

To simply run the migrations, use `yarn migrate`.

To run the migrate commands, first set `GO_DATABASE_URL`:

```bash
export GO_DATABASE_URL=$(cat env.json | gojq -r '.GO_DATABASE_URL')
```

To migrate:

```bash
migrate -database ${GO_DATABASE_URL} -path ./migrations up
```

To create a migration:

```bash
migrate create -ext sql -dir . -seq create_example_table
```

Then edit the sql and run the migrations.

To migrate down one level, and up one level:

```bash
migrate -database ${GO_DATABASE_URL} -path ./migrations down 1
migrate -database ${GO_DATABASE_URL} -path ./migrations up 1
```

Often in development the recorded number of the last completed migration in
the database and the state of the tables in the database goes in sync. To
change it, run force with the number you want recorded:

```bash
migrate -database ${GO_DATABASE_URL} -path ./migrations force 5
```

To view the currently recorded last completed migration:

```bash
migrate -database ${GO_DATABASE_URL} -path . status
```
