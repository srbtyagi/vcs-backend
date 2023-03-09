FROM node:alpine
WORKDIR /app
COPY . .
RUN apt update
RUN apt install python3-pip
RUN apt-get install python3 g++ make
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm i --force
EXPOSE 8000
CMD ["node", "app.js"]