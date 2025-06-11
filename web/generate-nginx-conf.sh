#!/bin/sh
# Generate nginx.conf using environment variables

cat <<EOF > /etc/nginx/conf.d/default.conf
server {
    listen ${WEB_PORT:-5173};

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Serve static assets with caching
    location /assets/ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF