FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY . .

ENV NODE_ENV=production

RUN bun install

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/http/server.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 8080