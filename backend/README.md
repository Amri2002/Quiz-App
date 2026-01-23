# Quiz App - FastAPI Backend

A FastAPI backend with Neon DB PostgreSQL and JWT authentication for the Quiz App.

## Features

- ✅ User authentication (signup/login)
- ✅ JWT token-based authorization
- ✅ Password hashing with bcrypt
- ✅ Neon DB PostgreSQL (serverless) integration
- ✅ Connection pooling optimized for Neon
- ✅ SSL/TLS encrypted database connections
- ✅ Teacher and student role management
- ✅ CORS enabled for frontend integration
- ✅ SQLAlchemy ORM
- ✅ Pydantic validation

## Prerequisites

- Python 3.8+
- Neon DB account (free tier available)
- pip or pip3

## Setup Instructions

### 1. Create Neon DB Database

1. Sign up at [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string (it looks like):
   ```
   postgresql://user:password@ep-xyz-123.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Neon automatically creates a database for you (usually named `neondb`, you can rename it to `quizapp`)

### 2. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your Neon DB connection string
# Replace the DATABASE_URL with your actual Neon connection string from step 1
# Generate a secure SECRET_KEY: openssl rand -hex 32
```

Example `.env` file:
```env
DATABASE_URL=postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/quizapp?sslmode=require
SECRET_KEY=your-generated-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

### 4. Run the Application

```bash
# Make sure you're in the backend directory with venv activated
uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

**Note**: On first run, SQLAlchemy will automatically create all necessary tables in your Neon database.

### 5. Access API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/token` - OAuth2 compatible token endpoint
- `GET /api/auth/me` - Get current user info (requires auth)
- `GET /api/auth/verify` - Verify token validity (requires auth)

### Health Check

- `GET /` - API info
- `GET /health` - Health check

## Request Examples

### Signup

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "username": "teacher123",
    "password": "securepass123",
    "full_name": "John Doe",
    "is_teacher": true
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "securepass123"
  }'
```

### Get Current User

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Schema

### Users Table

- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `hashed_password` - Bcrypt hashed password
- `full_name` - User's full name (optional)
- `is_active` - Account status
- `is_teacher` - Teacher role flag
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Token expiration (30 minutes default)
- SQL injection protection via SQLAlchemy ORM
- CORS configuration
- Input validation with Pydantic

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Database Migrations

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and run migrations
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Neon DB PostgreSQL connection string (with sslmode=require) | Required - get from Neon Console |
| `SECRET_KEY` | JWT secret key (generate with openssl rand -hex 32) | Required |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:3000"]` |

## Why Neon DB?

- **Serverless**: Auto-scaling with true serverless architecture
- **Connection Pooling**: Built-in connection pooling
- **Cost-Effective**: Pay only for what you use, generous free tier
- **Fast**: Instant database provisioning
- **Branching**: Database branching for development
- **No Maintenance**: Fully managed PostgreSQL

## Troubleshooting

### Database Connection Issues

- Verify your Neon connection string is correct
- Ensure `sslmode=require` is in the connection string
- Check your Neon project is active in the [console](https://console.neon.tech)
- Verify your IP isn't blocked (Neon's free tier allows all IPs)

### SSL Certificate Errors

If you encounter SSL errors, ensure:
- Your connection string includes `?sslmode=require`
- You have the latest `psycopg2-binary` installed

### Import Errors

- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Port Already in Use

- Change port: `uvicorn main:app --reload --port 8001`
- Or kill process using port 8000

## Next Steps

- Integrate with Next.js frontend
- Add quiz management endpoints
- Implement class management
- Add real-time features with WebSockets
- Set up email verification
- Add password reset functionality

## License

MIT
