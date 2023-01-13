FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN apk add --update python
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
FROM python:3
RUN pip install --no-cache-dir -r .