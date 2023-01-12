FROM node:lts-alpine
WORKDIR /app
COPY . .
FROM python:3.9-slim
RUN pip install filprofiler==2022.9.3
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm
RUN npm install
RUN npm install mysql --save
EXPOSE 8000
CMD ["node", "app.js"]
