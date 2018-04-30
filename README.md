# h1 Run the application for development

This application consists of two containers. MongoDB and a nodeJS application. 

In order to run the application for development we will need to set env and build/run the application's containers. 

Follow the below steps to run the application. 

# h2 Application environment 

The application enviroment is specifed in a .env. 

The repo contains a .env.dev file, copy the contents of that file to a .env and ensure that all env variables are set. 

# h2 Build the docker container 

To build the docker image of the backend run the following command in the root directory of the project: 

>docker build -f docker/Dockerfile -t james/venture1-back-end .

alternativly, you can run: 

>docker-compose build 

The above command will build the containers that are specified in the docker-compose file

# h2 Run the application 

Run the containers that are specifed in the docker-compose file: 

>docker-compose up 

# h2 Alternative to steps 2 and 3

You can build and run in a single command: 

>docker-compose up --build

# h2 Run the tests

Finally, run the tests to ensure proper setup:

command to run tests here :D
