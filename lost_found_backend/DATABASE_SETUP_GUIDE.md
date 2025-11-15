# MySQL Workbench Setup Guide

## Quick Setup Steps

### 1. Connect to MySQL Server
- Open MySQL Workbench
- Click on your local MySQL connection (usually `localhost:3306`)
- Enter your MySQL root password (or user credentials)

### 2. Import the SQL Schema

**Method 1: Using File Menu**
1. Go to `File` → `Open SQL Script`
2. Navigate to: `lost_found_backend/lost_and_found_schema.sql`
3. Click `Open`
4. Press `Ctrl+Shift+Enter` or click the ⚡ Execute button

**Method 2: Direct Import**
1. In MySQL Workbench, click on `Server` → `Data Import`
2. Select `Import from Self-Contained File`
3. Browse to `lost_and_found_schema.sql`
4. Select `New` and name it `lost_found_portal` under Default Target Schema
5. Click `Start Import`

### 3. Verify Installation

Run this query to verify:
```sql
USE lost_found_portal;
SHOW TABLES;
```

You should see these tables:
- role
- user_account
- category
- location
- item
- report
- item_image
- claim
- notification
- history
- session_audit

### 4. Check Default Data

```sql
-- Check roles
SELECT * FROM role;

-- Check categories
SELECT * FROM category;

-- Check locations
SELECT * FROM location;
```

## Database Connection Info

Default database name: `lost_found_portal`

The schema file will:
- ✅ Drop and recreate the database (be careful if you have existing data!)
- ✅ Create all tables with proper relationships
- ✅ Insert default roles, categories, and locations
- ✅ Create indexes for performance
- ✅ Set up views for common queries
- ✅ Create triggers for status changes
- ✅ Add stored procedures for claim approval/rejection

## Important Notes

⚠️ **Warning**: The SQL file uses `DROP DATABASE IF EXISTS` which will delete all existing data in the `lost_found_portal` database.

If you want to keep existing data:
1. Make a backup first
2. Comment out line 4: `-- DROP DATABASE IF EXISTS lost_found_portal;`
3. Comment out line 6: `-- CREATE DATABASE lost_found_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
4. Just run the table creation and data insertion parts

## Troubleshooting

**Error: "Access denied"**
- Make sure you're connected as a user with CREATE DATABASE privileges
- Try connecting as root user

**Error: "Syntax error near DELIMITER"**
- Make sure you're executing the entire file at once
- The DELIMITER statements are needed for triggers and stored procedures

**Tables not showing up**
- Click the refresh button (↻) in the Schemas panel
- Make sure you selected the correct schema in the navigation panel

