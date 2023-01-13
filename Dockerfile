FROM node:12
WORKDIR /app
COPY . .
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]