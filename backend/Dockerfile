# Setup some common things
FROM node:12 as base-stage
RUN mkdir -p /usr/app
RUN chown node:node /usr/app
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
COPY --chown=node:node ./.eslintrc /usr/app/.eslintrc
RUN npm set progress=false \
    && npm config set depth 0 \
    && npm ci --only=production \
    && npm cache clean --force
RUN cp -R node_modules prod_node_modules
RUN npm ci
RUN npm run lint

# And copy necessary stuff to alpine image
FROM node:12-alpine3.12 as release-stage
ARG PORT=9000
ENV NODE_ENV=production
EXPOSE $PORT
USER node
WORKDIR /usr/app
COPY --from=build-stage /usr/app/src /usr/app/src
COPY --from=build-stage /usr/app/prod_node_modules /usr/app/node_modules
CMD ["node","src/index.js"]
