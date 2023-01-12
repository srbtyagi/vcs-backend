FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install mysql --save
EXPOSE 8000
CMD ["node", "app.js"]
FROM python:3.9-slim
RUN pip install filprofiler==2022.9.3
