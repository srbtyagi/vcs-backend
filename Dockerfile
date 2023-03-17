FROM node
WORKDIR /app
COPY . .
RUN apt-get update
RUN apt-get install python3 g++ make
RUN npm i -g forever
RUN npm i --force
EXPOSE 8000
CMD ["forever", "start", "app.js"]