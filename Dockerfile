### STAGE 1: Build ###
FROM node AS build
# Create a Virtual directory inside the docker image
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/bora /usr/share/nginx/html