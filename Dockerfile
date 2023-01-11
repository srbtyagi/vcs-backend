FROM node:latest as build
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
WORKDIR /frontend/app
COPY ./ /frontend/app/
RUN npm install --force
RUN npm run build:angular
FROM nginx:latest
COPY nginx.conf /nginx/nginx.conf
COPY --from=build /frontend/app/dist/vishusaWeb /nginx/html
EXPOSE 80
FROM python:3.9-slim
RUN pip install filprofiler==2022.9.3