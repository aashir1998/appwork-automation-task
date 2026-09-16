# syntax=docker/dockerfile:1

# Tag must match the `cypress` version in package.json (currently 16.1.0) —
# a mismatch makes `npm ci` re-download the Cypress binary from the internet
# instead of using the one already baked into this image.
FROM cypress/included:16.1.0

# Set required env variables
# --disable-dev-shm-usage is intentionally NOT set: CI runners provide a
# properly sized /dev/shm, so Chromium should use it instead of falling back
# to disk. Heap size kept modest so it fits typical CI runner memory limits.
ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress \
    ELECTRON_EXTRA_LAUNCH_ARGS="--no-sandbox --js-flags=--max-old-space-size=3072" \
    NODE_OPTIONS="--max-old-space-size=3072" \
    CYPRESS_numTestsKeptInMemory=1

WORKDIR /app

COPY package.json package-lock.json ./
# Cache mount keeps npm's download cache across builds on the same builder,
# so a lockfile change only fetches what's new instead of everything.
RUN --mount=type=cache,target=/root/.npm npm ci --silent

COPY . .

# Runs at `docker run` time (not build time) so CI can pick the suite via
# the trailing arg, e.g. `docker run <image> test:smoke`.
ENTRYPOINT ["npm", "run"]
CMD ["test"]