#!/bin/bash

# Configuration (using the same values from deploy.sh for consistency)
REMOTE_USER="root"
REMOTE_HOST="103.6.170.73"
REMOTE_PASSWORD="l0zj3NT9fRtZOUQ"
DOMAIN="motis.group"
REMOTE_PATH="/var/www/motis-website"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
  echo -e "${GREEN}[STATUS]${NC} $1"
}

# Function to print error messages
print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# SSH command wrapper
remote_command() {
  sshpass -p $REMOTE_PASSWORD ssh $REMOTE_USER@$REMOTE_HOST "$1"
}

# Create Nginx configuration
NGINX_CONFIG="server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    root $REMOTE_PATH;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}

# Redirect IP address to domain
server {
    listen 80;
    listen [::]:80;
    server_name $REMOTE_HOST;
    return 301 http://$DOMAIN\$request_uri;
}"

print_status "Backing up existing Nginx configurations..."
if ! remote_command "mkdir -p /etc/nginx/sites-available/backup && cp -r /etc/nginx/sites-available/*.conf /etc/nginx/sites-available/backup/ 2>/dev/null || true"; then
  print_error "Failed to backup Nginx configurations!"
fi

print_status "Creating new Nginx configuration..."
if ! remote_command "echo '$NGINX_CONFIG' > /etc/nginx/sites-available/$DOMAIN.conf"; then
  print_error "Failed to create Nginx configuration!"
fi

print_status "Cleaning up old configurations..."
if ! remote_command "rm -f /etc/nginx/sites-enabled/* && rm -f /etc/nginx/sites-available/mywebsite*"; then
  print_error "Failed to clean up old configurations!"
fi

print_status "Enabling new site configuration..."
if ! remote_command "ln -sf /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/"; then
  print_error "Failed to enable site configuration!"
fi

print_status "Testing Nginx configuration..."
if ! remote_command "nginx -t"; then
  print_error "Nginx configuration test failed!"
fi

print_status "Restarting Nginx to apply new configuration..."
if ! remote_command "systemctl restart nginx"; then
  print_error "Failed to restart Nginx!"
fi

print_status "Updating package list..."
if ! remote_command "apt-get update"; then
  print_error "Failed to update package list!"
fi

print_status "Installing certbot and nginx plugin..."
if ! remote_command "apt-get install -y certbot python3-certbot-nginx"; then
  print_error "Failed to install certbot!"
fi

print_status "Obtaining SSL certificate..."
if ! remote_command "certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN"; then
  print_error "Failed to obtain SSL certificate!"
fi

print_status "Testing certificate renewal..."
if ! remote_command "certbot renew --dry-run"; then
  print_error "Certificate renewal test failed!"
fi

print_status "Final Nginx restart..."
if ! remote_command "systemctl restart nginx && systemctl reload nginx"; then
  print_error "Failed to restart nginx!"
fi

print_status "Checking nginx status..."
remote_command "systemctl status nginx"

print_status "HTTPS implementation completed successfully!"
print_status "Your website should now be accessible via https://$DOMAIN"
