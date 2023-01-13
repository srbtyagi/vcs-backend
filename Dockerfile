FROM node:12
WORKDIR /app
COPY . .
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
FROM python:3
RUN pip install --no-cache-dir -r .