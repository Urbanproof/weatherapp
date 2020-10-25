# Is this meant to be a development-only container?
# There are no build steps defined, so none accounted for. ¯\_(ツ)_/¯
# Still, multistage could be beneficial if build step is added later on.

# Setup some common things
FROM node:12 as base-stage
USER node
WORKDIR /usr/app
COPY --chown=node:node package*.json ./

# Install dev-only stuff
FROM base-stage as dev-stage
COPY --chown=node:node webpack.config.js ./webpack.config.js
ARG PORT=80
ENV NODE_ENV=development
ENV PORT=$PORT
EXPOSE $PORT
RUN npm install && npm cache clean --force
CMD ["npm","start"]
