FROM postgres:16.4
ENV POSTGRES_USER=postgres
# todo: replace thie password somewhere safe!
ENV POSTGRES_PASSWORD=test1234
ENV POSTGRES_DB=gaspsweassignment2024db
COPY seeded-db.sql /docker-entrypoint-initdb.d/
