FROM node:carbon

#Create application directory
WORKDIR /usr/src/app

#Install application dependencies
#A wildcard is used to ensure both package.json + package-lock.json are copied
COPY package*.json ./

#wait-for-it.sh is a script that will poll our mongodb connection. It is used to start our node application after mongo DB is ready. This avoids a DB connection error and enables us to keep the logic out of the application.
#see https://github.com/vishnubob/wait-for-it for more info
COPY wait-for-it.sh .

#For dev: RUN npm install
#For prod: RUN npm install --only=production
RUN npm install

#bundle application source
COPY . .

EXPOSE 8090
