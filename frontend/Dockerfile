# Setup some common things
FROM node:12 as base-stage
RUN mkdir -p /usr/app
RUN chown node:node /usr/app
USER node
WORKDIR /usr/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node webpack.config.js ./webpack.config.js
RUN npm set progress=false \
    && npm config set depth 0 \
    && npm ci --no-optional \
    && npm cache clean --force

# Install dev-only stuff
FROM base-stage as dev-stage
ARG PORT=80
ENV NODE_ENV=development
ENV PORT=$PORT
EXPOSE $PORT
CMD ["npm","start"]

# Install prod-only stuff
FROM base-stage as build-stage
ARG WEATHERAPI_ENDPOINT
ENV NODE_ENV=production
ENV ENDPOINT=$WEATHERAPI_ENDPOINT
COPY --chown=node:node ./src /usr/app/src
COPY --chown=node:node ./.eslintrc /usr/app/.eslintrc
RUN npm run lint && npm run build

# And copy necessary stuff to nginx alpine image
FROM nginx:stable-alpine
# Silence entrypoint nags caused by custom config. Disable for debugging.
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1
EXPOSE 80
COPY --from=build-stage /usr/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
