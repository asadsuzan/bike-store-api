# 🚲 Bike Store API (Assignment 2)

An Express-based backend built with TypeScript and integrated with MongoDB using Mongoose to manage a Bike Store. It includes secure routes, data validation, and role-based access control. Payment processing is handled through **ShurjoPay**, a reliable payment gateway. The APIs are hosted on **Vercel Deploy** for efficient and scalable deployment.

## 📋 Features

- CRUD operations for Bikes
- Order management with **ShurjoPay** payment verification
- User authentication and profile management
- Role-based access (Admin and Customer)
- Comprehensive validation for queries and request bodies
- Security headers using Helmet
- CORS setup for client communication

---

## 🛠️ Scripts

| Command        | Description                           |
|----------------|----------------------------------------|
| `npm run dev`  | Starts the development server         |
| `npm run start`| Runs the production build             |
| `npm run build`| Builds the project for production     |
| `npm run lint` | Lints the codebase                     |
| `npm run lint:fix` | Fixes lint issues                 |
| `npm run format` | Formats the codebase with Prettier  |

---

## 🏗️ API Endpoints

### 🚴‍♂️ Bike Routes

| Method | Endpoint               | Description                   | Access |
|--------|-------------------------|-------------------------------|--------|
| POST   | `/api/products`         | Create a new bike            | Admin  |
| GET    | `/api/products`         | Get all bikes                | Public |
| GET    | `/api/products/:id`     | Get a specific bike          | Public |
| PUT    | `/api/products/:id`     | Update a bike                | Admin  |
| DELETE | `/api/products/:id`     | Delete a bike                | Admin  |

---

### 📦 Order Routes

| Method | Endpoint               | Description                   | Access    |
|--------|-------------------------|-------------------------------|-----------|
| POST   | `/api/order/`           | Create a new order            | Customer  |
| GET    | `/api/order/verify-payment` | Verify ShurjoPay payment | Customer/Admin |
| GET    | `/api/order/orders`     | Get all orders                | Customer/Admin |
| DELETE | `/api/order/:orderId`   | Delete an order               | Customer/Admin |

---

### 👤 User Routes

| Method | Endpoint                | Description                  | Access        |
|--------|--------------------------|------------------------------|---------------|
| POST   | `/api/user/register`     | Register a new user         | Public        |
| POST   | `/api/user/login`        | Login a user                | Public        |
| GET    | `/api/user/count`        | Get customer count          | Admin         |
| GET    | `/api/user/profile`      | Get user profile            | Customer/Admin |
| PUT    | `/api/user/profile`      | Update user profile         | Customer/Admin |

---

## 🔐 Security

- **CORS:** Configured for cross-origin requests
- **JWT Authentication:** Secure routes using JSON Web Tokens
- **Helmet:** Security headers to protect against common vulnerabilities

---

## 🛠️ Installation

```bash
git clone https://github.com/asadsuzan/bike-store-api.git
cd bike-store-api
npm install
```

### Running the Application

```bash
npm run dev
```

To run the application locally, you need to configure environment variables. Below is a sample `.env` file:

```
PORT= 
DB_URI="" 
JWT_SECRET=
JWT_ACCESS_EXPIRE=
NODE_ENV=production
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PREFIX=SP
SP_RETURN_URL=http://localhost:5173/order/verify-order
DB_FILE=./shurjopay-tx.db
ALLOWED_ORIGIN=https:http://localhost:5173
```
Ensure you replace the empty `DB_URI` value with your MongoDB connection string.

---

## 🔗 Frontend Repository

[View on GitHub](https://github.com/asadsuzan/bike-store-api)

## 🔗 Live Link
[https://bikebd-client.vercel.app/ ](https://bikebd-client.vercel.app/)


## 🤝 Contributions

Contributions are welcome! Feel free to open issues or submit pull requests for improvements.

## 🧑 Author

Developed by **MD Asaduzzaman Suzan**

