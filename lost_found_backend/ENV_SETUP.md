# Environment Setup Guide

## Creating the .env File

Create a `.env` file in the `lost_found_backend` directory with the following content:

```env
# Database Configuration
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=lost_found_portal

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production-use-a-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Upload Directory
UPLOAD_DIR=./uploads
```

## Generating a Secure SECRET_KEY

You can generate a secure secret key using Python:

```python
import secrets
print(secrets.token_urlsafe(32))
```

Or using OpenSSL:

```bash
openssl rand -hex 32
```

## Database Setup

1. **Create the MySQL database:**
```sql
CREATE DATABASE lost_found_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Create a MySQL user (optional but recommended):**
```sql
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON lost_found_portal.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Update the `.env` file with your database credentials**

4. **Run the initialization script:**
```bash
python init_db.py
```

This will create all tables and seed the initial roles.

