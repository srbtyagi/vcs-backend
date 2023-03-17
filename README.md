## Local

docker build . -t vcs/docker-img
docker run -p 8000:8000 -d vcs/docker-img

## Push to aws ecr

docker build -t vcs-api .

https://www.youtube.com/watch?v=yhiuV6cqkNs