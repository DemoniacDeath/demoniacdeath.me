FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html
COPY content /usr/share/nginx/html
