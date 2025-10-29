<<<<<<< HEAD
# whispa_backend
=======
# Whispa Backend

Anonymous Q&A Platform Backend built with NestJS, Prisma, and PostgreSQL.

## Features

- ✅ User Authentication (Register/Login with JWT + HTTP-only cookies)
- ✅ Password hashing with bcrypt
- ✅ Email service with ZeptoMail SMTP
- ✅ Welcome emails, verification emails, password reset emails
- ✅ Input validation with class-validator
- ✅ PostgreSQL database with Prisma ORM
- ✅ Modular architecture following NestJS best practices
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Global error handling
- ✅ TypeScript strict mode

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **ORM**: Prisma 5.x
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, bcrypt
- **Language**: TypeScript 5.x

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=4001
   DATABASE_URL="postgresql://user:password@localhost:5432/whispa_db?schema=public"
   JWT_SECRET=your_secret_key_change_in_production
   JWT_EXPIRES_IN=1h
   FRONTEND_URL=http://localhost:3000
   BCRYPT_SALT_ROUNDS=10
   ```

4. **Setup database**

   Create PostgreSQL database:

   ```bash
   createdb whispa_db
   ```

5. **Run Prisma migrations**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Start the server**

   ```bash
   # Development mode with hot-reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

The server will start on `http://localhost:4001/api`

## API Documentation

### Base URL

```
http://localhost:4001/api
```

### Authentication Endpoints

#### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "allowAnonymous": true
}
```

**Response (201 Created):**

```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "allowAnonymous": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Cookies Set:**

- `token` (HTTP-only, Secure in production, SameSite=Strict)

**Error Responses:**

- `409 Conflict` - Email or username already exists
- `400 Bad Request` - Validation errors (missing fields, invalid email, password < 8 chars)

---

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",  // or "johndoe" (username)
  "password": "SecurePass123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "allowAnonymous": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Cookies Set:**

- `token` (HTTP-only, Secure in production, SameSite=Strict)

**Error Responses:**

- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation errors

---

#### 3. Get Current User

```http
GET /api/auth/me
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token

---

#### 4. Logout

```http
POST /api/auth/logout
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

The `token` cookie will be cleared.

---

### Users Endpoints

#### 1. Get User by ID

```http
GET /api/users/:id
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "allowAnonymous": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

---

## Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Generate coverage report

```bash
npm run test:cov
```

### Run e2e tests

```bash
npm run test:e2e
```

---

## Database Commands

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Create a new migration

```bash
npm run prisma:migrate
```

### Apply migrations in production

```bash
npm run prisma:deploy
```

### Open Prisma Studio (DB GUI)

```bash
npm run prisma:studio
```

### Reset database (⚠️ deletes all data)

```bash
npx prisma migrate reset
```

---

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── users/
│       ├── dto/
│       │   └── create-user.dto.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   └── filters/
│       └── http-exception.filter.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── shared/
│   └── constants/
│       └── roles.constant.ts
├── app.module.ts
└── main.ts
```

---

## Environment Variables

| Variable                 | Description                     | Default                 | Required |
| ------------------------ | ------------------------------- | ----------------------- | -------- |
| `NODE_ENV`               | Environment mode                | `development`           | Yes      |
| `PORT`                   | Server port                     | `4001`                  | No       |
| `API_PREFIX`             | API route prefix                | `api`                   | No       |
| `DATABASE_URL`           | PostgreSQL connection string    | -                       | Yes      |
| `JWT_SECRET`             | JWT signing secret              | -                       | Yes      |
| `JWT_EXPIRES_IN`         | JWT expiration time             | `1h`                    | No       |
| `JWT_REFRESH_SECRET`     | Refresh token secret            | -                       | No       |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration        | `7d`                    | No       |
| `FRONTEND_URL`           | Frontend URL for CORS           | `http://localhost:3000` | Yes      |
| `ALLOWED_ORIGINS`        | Comma-separated allowed origins | -                       | No       |
| `BCRYPT_SALT_ROUNDS`     | Bcrypt salt rounds              | `10`                    | No       |
| `ZEPTOMAIL_USER`         | ZeptoMail SMTP username         | -                       | Yes      |
| `ZEPTOMAIL_KEY`          | ZeptoMail Send Mail Token       | -                       | Yes      |
| `ZEPTOMAIL_FROM_EMAIL`   | Sender email address            | -                       | Yes      |
| `ZEPTOMAIL_FROM_NAME`    | Sender name                     | -                       | Yes      |
| `APP_URL`                | Application URL for email links | `http://localhost:3000` | Yes      |
| `SUPPORT_EMAIL`          | Support email address           | `support@whispa.com`    | No       |

---

## Email Service Setup

The application uses **ZeptoMail** for reliable transactional email delivery.

### Getting ZeptoMail Credentials

1. **Sign up for ZeptoMail**: Visit [https://www.zoho.com/zeptomail/](https://www.zoho.com/zeptomail/)
2. **Add and verify your domain**: Follow ZeptoMail's domain verification process
3. **Get SMTP credentials**:
   - Navigate to **Settings** → **SMTP**
   - Copy your **Username** (e.g., `emailapikey`)
   - Generate a new **Send Mail Token** and copy it
4. **Configure authorized sender**: Add your sending email address in ZeptoMail dashboard

### Email Configuration in `.env`

```env
# Email Configuration (ZeptoMail SMTP)
ZEPTOMAIL_USER=emailapikey
ZEPTOMAIL_KEY=your-send-mail-token-here
ZEPTOMAIL_FROM_EMAIL=noreply@yourdomain.com
ZEPTOMAIL_FROM_NAME=Whispa
APP_URL=http://localhost:3000
SUPPORT_EMAIL=support@yourdomain.com
```

### Email Types

The application automatically sends the following emails:

1. **Welcome Email**: Sent immediately after user registration
2. **Verification Email**: For email address verification (when implemented)
3. **Password Reset Email**: For forgotten password recovery (when implemented)

### Email Templates

All email templates are professionally designed with:

- Responsive HTML design
- Mobile-friendly layouts
- Consistent branding
- Clear call-to-action buttons
- Security notices where applicable

### Testing Email Service

To test the email service in development:

```bash
# Start the server
npm run start:dev

# Register a new user with a valid email
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser",
    "email": "your-email@example.com",
    "password": "SecurePass123",
    "allowAnonymous": true
  }'

# Check your inbox for the welcome email
```

**Note**: Email sending is non-blocking. If email delivery fails, registration will still succeed. Check server logs for email sending status.

---

## Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Tokens stored in secure cookies
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers middleware
- **Input Validation**: class-validator on all DTOs
- **SQL Injection Protection**: Prisma parameterized queries

---

## Scripts

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `npm run start`           | Start server              |
| `npm run start:dev`       | Start with hot-reload     |
| `npm run start:prod`      | Start production build    |
| `npm run build`           | Build for production      |
| `npm run lint`            | Run ESLint                |
| `npm run format`          | Format code with Prettier |
| `npm test`                | Run tests                 |
| `npm run test:watch`      | Run tests in watch mode   |
| `npm run test:cov`        | Generate coverage report  |
| `npm run prisma:generate` | Generate Prisma Client    |
| `npm run prisma:migrate`  | Run migrations            |
| `npm run prisma:studio`   | Open Prisma Studio        |

---

## Development

### Code Style

- Follow NestJS best practices
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write tests for all services and controllers

### Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes

---

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env`
3. Ensure database exists: `psql -l`

### Migration Errors

1. Reset migrations: `npx prisma migrate reset`
2. Generate client: `npm run prisma:generate`
3. Run migrations: `npm run prisma:migrate`

### Port Already in Use

```bash
# Kill process on port 4001
lsof -ti:4001 | xargs kill -9
```

---

## License

Proprietary - All rights reserved

---

## Support

For issues and questions, contact: support@whispa.me
>>>>>>> b699a92 (Initial backend push)
