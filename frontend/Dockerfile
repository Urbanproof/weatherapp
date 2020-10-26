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
    && npm install  --no-optional \
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
ENV NODE_ENV=production
COPY --chown=node:node ./src /usr/app/src
# Linting & aborting on lint errors might actually be a good idea.
# Maybe out of scope for now.
RUN npm run build

# And copy necessary stuff to nginx alpine image
FROM nginx:stable-alpine
EXPOSE 80
COPY --from=build-stage /usr/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
