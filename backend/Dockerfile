# Setup some common things
FROM node:12 as base-stage
USER node
WORKDIR /usr/app
COPY --chown=node:node package*.json ./

# Install dev-only stuff
FROM base-stage as dev-stage
ENV NODE_ENV=development
ARG PORT=9000
EXPOSE $PORT
RUN npm install && npm cache clean --force
CMD ["npm","run", "dev"]

# Install prod-only stuff
FROM base-stage as build-stage
COPY --chown=node:node ./src /usr/app/src
ENV NODE_ENV=production
RUN npm set progress=false \
    && npm config set depth 0 \
    && npm install --only=production \
    && npm cache clean --force

# And copy necessary stuff to alpine image
FROM node:12-alpine3.12 as release-stage
ARG PORT=9000
EXPOSE $PORT
USER node
WORKDIR /usr/app
COPY --from=build-stage /usr/app/src /usr/app/src
COPY --from=build-stage /usr/app/node_modules /usr/app/node_modules
CMD ["node","src/index.js"]
