# docker build -t botbloq-its-front .
# docker run -p 80:80 -dit botbloq-its-front

FROM nginx
COPY dist /usr/share/nginx/html
EXPOSE 80
