# Neon DB Setup Guide

Quick guide to setting up Neon DB for your Quiz App backend.

## Step 1: Create Neon Account

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub, Google, or Email
3. Verify your email

## Step 2: Create a Project

1. Click **"New Project"**
2. Choose a project name (e.g., "Quiz App")
3. Select a region closest to you
4. Click **"Create Project"**

## Step 3: Get Connection String

After project creation, you'll see:

### Connection String
```
postgresql://user:password@ep-abc-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Connection Details
- **Host**: `ep-abc-123.us-east-2.aws.neon.tech`
- **Database**: `neondb`
- **User**: Your username
- **Password**: Your password
- **Port**: `5432` (default)

## Step 4: (Optional) Rename Database

If you want to use `quizapp` as the database name:

1. Go to **SQL Editor** in Neon Console
2. Run:
   ```sql
   CREATE DATABASE quizapp;
   ```
3. Update your connection string to use `quizapp` instead of `neondb`

## Step 5: Configure Your Backend

1. Copy your connection string
2. Edit `backend/.env`:
   ```env
   DATABASE_URL=postgresql://user:password@ep-abc-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 6: Test Connection

```bash
cd backend
python -c "from database import engine; print('Connection successful!' if engine.connect() else 'Connection failed')"
```

## Neon Features

### Free Tier Includes:
- ✅ 3 GB storage
- ✅ Unlimited compute hours (with reasonable limits)
- ✅ Connection pooling
- ✅ Point-in-time recovery
- ✅ Database branching

### Dashboard Features:
- **Monitoring**: View connections, queries, and performance
- **SQL Editor**: Run queries directly in browser
- **Branching**: Create database branches for testing
- **Backups**: Automatic point-in-time recovery

## Security Best Practices

1. **Never commit `.env` file** - It contains your database password
2. **Use different databases** for development/production
3. **Rotate passwords** regularly from Neon Console
4. **Enable IP allowlist** if needed (Settings → IP Allow)

## Connection Pooling

Neon has built-in connection pooling. Your backend is configured with:

```python
pool_size=10          # 10 connections in pool
max_overflow=20       # Up to 20 extra connections if needed
pool_recycle=3600     # Recycle connections every hour
pool_pre_ping=True    # Check connection health before using
```

## Troubleshooting

### "SSL connection required"
- Ensure your connection string has `?sslmode=require`

### "Connection timeout"
- Check your internet connection
- Verify Neon project is active in console

### "Password authentication failed"
- Reset password in Neon Console → Settings
- Update `.env` with new password

### "Database does not exist"
- Create database in SQL Editor or use default `neondb`

## Useful SQL Commands

### Check tables:
```sql
\dt
```

### View users table:
```sql
SELECT * FROM users LIMIT 10;
```

### Count users:
```sql
SELECT COUNT(*) FROM users;
```

### Reset database (careful!):
```sql
DROP TABLE IF EXISTS users CASCADE;
```

Then restart your FastAPI app to recreate tables.

## Migration from Local PostgreSQL

If you had data in local PostgreSQL:

1. Export data:
   ```bash
   pg_dump -U postgres quizapp > backup.sql
   ```

2. Import to Neon (using SQL Editor or):
   ```bash
   psql "postgresql://user:pass@ep-abc.neon.tech/neondb?sslmode=require" < backup.sql
   ```

## Next Steps

- ✅ Connection string configured
- ✅ Tables auto-created on first run
- ✅ Start using the API!

For more features, check out [Neon Documentation](https://neon.tech/docs).
