FROM node
FROM python
WORKDIR /app
COPY . .
RUN apt-get update
RUN apt-get install -y python3-pip
RUN apt-get install python3 g++ make
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm i --force
EXPOSE 8000
CMD ["node", "app.js"]