FROM node:12
WORKDIR /app
COPY . .
RUN apt-get install python3 g++ make python3-pip
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]