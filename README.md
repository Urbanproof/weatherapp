# Usage instructions


## Prerequisites

- Required
    - Docker 17.05 or higher
    - Internet access
    - An [openweathermap](http://openweathermap.org/) API key
- Useful
    - Git (not necessary if you donwload the archive version of this repository)
    - Node version 8.2.0 or later & npm version 5.2.0 or later to run helper scripts
    (ofc if you can use Node directly, one could argue that there is no point to run docker in the first place)

Limitations above are not guaranteed to be correct, but rather checked from API-limitations (ie. npx command is only available on npm 5.2.0 or later etc.). Every command should be cross platform compatible, but due to severe hardware limitations this project is only tested on:
- Ubuntu 18.04.5 LTS
    - Running in WSL2 VM with Windows 10 build 19042
- Docker Desktop v2.4.0.0
    - Docker version 19.03.13
    - docker-compose version 1.27.4
    - WSL2 Backend
- Node version 12.18.4
- npm version 6.14.8


## Setting up the environment

Both frontend and backend somewhat depend from the environment. Most of the environment variables have sensible defaults, but provide at minimun:
- backend: the OpenWeather API-key
- frontend: backend hostname
    - this should be the reachable hostname of your docker host, not the docker network internal one, as the request is done in the browser
    - running locally http://localhost:9000/api should work given that you haven't changed the default port

There are two possible ways to inject environment variables to containers;
- add .env -file to service directory (there are .env.example files for your convenience)
    - simply copy&paste the .example file, rename to .env and fill in the data
- inject variables yourself, either with custom docker commands, customizing the docker-compose file, from the command line...
    - even in this case, check out the .env.example files for required variables


## Starting the services


### Using docker-compose

Simply run `docker-compose up -d` in project root directory. Note that this way containers are built & started using _development_ configuration.
There is no docker-compose file provided for production deployment because you probably shouldn't be using docker-compose for that.


### Using docker commands

Run following commands against corresponding service's root directory, ie. before running backend-commands, run `cd backend`.


#### Backend

1. Using npm helper scripts:
    - `npm run docker` - builds & starts the container
    - `npm run docker-dev` - builds & starts the container for development
    - `npm run docker:stop` - stops & removes the container
    - `npm run docker:build` - builds the container
    - `npm run docker:build-dev` - builds the container for development
    - `npm run docker:run` - starts the container
    - `npm run docker:run-dev` - starts the container for development
2. Using docker commands directly
    - build for production: `docker build -t weatherapp_backend .`
    - build for development: `docker build -t weatherapp_backend --target=dev-stage .`
    - run in production: `docker run --rm -d -p 9000:9000 --env-file .env --name weatherapp_backend weatherapp_backend`
        - note thath you must build the image for production before running this
    - run in development: `docker run --init --rm -d -p 9000:9000 -v $(pwd)/src:/usr/app/src --env-file .env --name weatherapp_backend weatherapp_backend`
        - note thath you must build the image for development before running this

#### Frontend

Frontend has no production configuration, so only development commands are available.

1. Using npm helper scripts:
    - `npm run docker-dev` - builds & starts the container for development
    - `npm run docker:stop` - stops & removes the container
    - `npm run docker:build-dev` - builds the container for development
    - `npm run docker:run-dev` - starts the container for development
2. Using docker commands directly
    - build for development: `docker build -t weatherapp_frontend --build-arg PORT=8000 --target=dev-stage .`
    - run in development: `docker run --init --rm -d -p 8000:8000 -v $(pwd)/src:/usr/app/src --env-file .env --name weatherapp_frontend weatherapp_frontend`


---
Original documentation below.

---


# Weatherapp

There was a beautiful idea of building an app that would show the upcoming weather. The developers wrote a nice backend and a frontend following the latest principles and - to be honest - bells and whistles. However, the developers did not remember to add any information about the infrastructure or even setup instructions in the source code.

Luckily we now have [docker compose](https://docs.docker.com/compose/) saving us from installing the tools on our computer, and making sure the app looks (and is) the same in development and in production. All we need is someone to add the few missing files!

## Prerequisites

* An [openweathermap](http://openweathermap.org/) API key.

## Returning your solution

### Via github

* Make a copy of this repository in your own github account (do not fork unless you really want to be public).
* Create a personal repository in github.
* Make changes, commit them, and push them in your own repository.
* Send us the url where to find the code.

### Via tar-package

* Clone this repository.
* Make changes and **commit them**.
* Create a **.tgz** -package including the **.git**-directory, but excluding the **node_modules**-directories.
* Send us the archive.

## Exercises

Here are some things in different categories that you can do to make the app better. Before starting you need to get yourself an API key to make queries in the [openweathermap](http://openweathermap.org/). You can run the app locally using `npm i && npm start`.

### Docker

*Docker containers are central to any modern development initiative. By knowing how to set up your application into containers and make them interact with each other, you have learned a highly useful skill.*

* Add **Dockerfile**'s in the *frontend* and the *backend* directories to run them virtually on any environment having [docker](https://www.docker.com/) installed. It should work by saying e.g. `docker build -t weatherapp_backend . && docker run --rm -i -p 9000:9000 --name weatherapp_backend -t weatherapp_backend`. If it doesn't, remember to check your api key first.

* Add a **docker-compose.yml** -file connecting the frontend and the backend, enabling running the app in a connected set of containers.

* The developers are still keen to run the app and its pipeline on their own computers. Share the development files for the container by using volumes, and make sure the containers are started with a command enabling hot reload.

### Node and React development

*Node and React applications are highly popular technologies. Understanding them will give you an advantage in front- and back-end development projects.*

* The application now only reports the current weather. It should probably report the forecast e.g. a few hours from now. (tip: [openweathermap api](https://openweathermap.org/forecast5))

* There are [eslint](http://eslint.org/) errors. Sloppy coding it seems. Please help.

* The app currently reports the weather only for location defined in the *backend*. Shouldn't it check the browser location and use that as the reference for making a forecast? (tip: [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation))

### Testing

*Test automation is key in developing good quality applications. Finding bugs in early stages of development is valuable in any software development project. With Robot Framework you can create integration tests that also serve as feature descriptions, making them exceptionally useful.*

* Create automated tests for the application. (tip: [mocha](https://mochajs.org/))

* Create [Robot Framework](http://robotframework.org/) integration tests. Hint: Start by creating a third container that gives expected weather data and direct the backend queries there by redefining the **MAP_ENDPOINT**.

### Cloud

*The biggest trend of recent times is developing, deploying and hosting your applications in cloud. Knowing cloud -related technologies is essential for modern IT specialists.*

* Set up the weather service in a free cloud hosting service, e.g. [AWS](https://aws.amazon.com/free/) or [Google Cloud](https://cloud.google.com/free/).

### Ansible

*Automating deployment processes saves a lot of valuable time and reduces chances of costly errors. Infrastructure as Code removes manual steps and allows people to concentrate on core activities.*

* Write [ansible](http://docs.ansible.com/ansible/intro.html) playbooks for installing [docker](https://www.docker.com/) and the app itself.

### Documentation

*Good documentation benefits everyone.*

* Remember to update the README

* Use descriptive names and add comments in the code when necessary

### ProTips

* When you are coding the application imagine that you are a freelancer developer developing an application for an important customer.

* The app must be ready to deploy and work flawlessly.

* The app must be easy to deploy to your local machine with and without Docker.

* Detailed instructions to run the app should be included in your forked version because a customer would expect detailed instructions also.

* Structure the code and project folder structure in a modular and logical fashion for extra points.

* Try to avoid any bugs or weirdness in the operating logic.
