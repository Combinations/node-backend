This is a backend application built with nodejs/express/mongodb. It is setup to run in AWS's Elastic Beanstalk. 

# Running the application for development

This application consists of two containers. MongoDB and a NodeJS application. 

In order to run the application for development we will need to set env and build/run the application's containers. 

Follow the below steps to run the application. 

## Application environment 

The NodeJS application expects its enviroment to be specifed in a file named .env 

The repo contains a .env.dev file, copy the contents of that file to .env and ensure that all env variables are set

## Build the NodeJS container 

To build the docker image of the backend run the following command in the root directory of the project: 

>docker build -f docker/Dockerfile -t path/<repo-name> .

alternativly, you can run: 

>docker-compose build 

The above command will build the containers that are specified in the docker-compose file

## Run the application 

Run the containers that are specifed in the docker-compose file: 

>docker-compose up 

## Alternative to steps 2 and 3

You can build and run in a single command: 

>docker-compose up --build
