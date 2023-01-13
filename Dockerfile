FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
RUN pip3 install --no-cache --upgrade pip setuptools