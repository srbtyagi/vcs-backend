FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
FROM python:3.9-slim
RUN pip install filprofiler==2022.9.3

#Install Packages
RUN npm install express --save
RUN npm install mysql --save

