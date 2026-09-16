# syntax=docker/dockerfile:1


FROM cypress/base:24.11.0

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

RUN --mount=type=cache,target=/root/.npm npm ci --silent && npx cypress verify

COPY . .

# Runs at `docker run` time (not build time) so CI can pick the suite via
# the trailing arg, e.g. `docker run <image> test:smoke`.
ENTRYPOINT ["npm", "run"]
CMD ["test"]