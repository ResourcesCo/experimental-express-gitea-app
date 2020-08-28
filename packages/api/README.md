## Running the migrations

The migrations are based on [migrate](https://github.com/golang-migrate/migrate).
[Download a release](https://github.com/golang-migrate/migrate) or install with
the following command:

```bash
go get -tags 'postgres' -u github.com/golang-migrate/migrate/cmd/migrate
```

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
