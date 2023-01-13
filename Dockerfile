FROM node:alpine3.11
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
FROM python:3
RUN pip install --no-cache-dir -r .