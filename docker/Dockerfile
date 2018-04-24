FROM node:carbon

#Create application directory
WORKDIR /usr/src/app

#Install application dependencies
#A wildcard is used to ensure both package.json + package-lock.json are copied
COPY package*.json ./

#For dev: RUN npm install
#For prod: RUN npm install --only=production
RUN npm install

#bundle application source
COPY . .

EXPOSE 8090

CMD ["yarn", "start"]
