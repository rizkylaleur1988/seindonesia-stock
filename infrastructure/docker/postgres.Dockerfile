FROM postgis/postgis:17-3.5-alpine

ARG PG_PARTMAN_VERSION=5.2.4

RUN apk add --no-cache --virtual .build-deps build-base git \
    && git clone --depth 1 --branch "v${PG_PARTMAN_VERSION}" https://github.com/pgpartman/pg_partman.git /tmp/pg_partman \
    && make -C /tmp/pg_partman with_llvm=no \
    && make -C /tmp/pg_partman install with_llvm=no \
    && rm -rf /tmp/pg_partman \
    && apk del .build-deps