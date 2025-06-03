# Authentication System with Node.js

Complete authentication project using Node.js, Express, MongoDB, and JSON Web Tokens (JWT). Includes:

- User registration
- Login with JWT tokens
- Authentication using cookies
- Rate limiting
- Account lockout after multiple failed attempts
- Data validation with Zod
- Role and permission control

---

## 🚀 Technologies

- Node.js
- Express
- MongoDB + Mongoose
- J.W.T.
- Zod
- Bcrypt
- express-rate-limit
- dotenv
- cookie-parse

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yapu115/Auth_System
cd Auth_System
````

2. Install the dependencies

```bash
npm install
````

3. Configure the .env file:

```bash
PORT=5003
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=secret_key
JWT_REFRESH_SECRET=secret_refresh_key
NODE_ENV=development
````

4. Start the server:
```bash
npm run dev
````

---

## 📬 Main Endpoints

- POST /auth/register → User Registration
- POST /auth/login → User Login
- POST /auth/change-password → Password Change
- GET /users/profile → Protected Path (requires JWT or cookie)
- GET /auth/all → Protected Path to get all users (Only admins can access)

---

## 🧪 Testing

You can test using .rest files with VSCode and the REST Client extension.
