FROM node:alpine
WORKDIR /usr/app
COPY ./ /usr/app
FROM python:3.9-slim
RUN pip install filprofiler==2022.9.3
RUN npm install
RUN npm install mysql --save
EXPOSE 8000
CMD ["node", "app.js"]
