# projectx

## How to run

```bash
# create docker container 
docker-compose up

# migrate database
make db-migrate

# add example data to database (optional)
make db-seed

# start server
make run
```

and for tests

```bash
make db-reset && make db-seed && make test-coverage
```
