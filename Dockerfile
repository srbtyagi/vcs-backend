FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]

#Install Packages
RUN npm install express --save
RUN npm install mysql --save

