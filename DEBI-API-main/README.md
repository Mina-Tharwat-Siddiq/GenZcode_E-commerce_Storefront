# Ecommerce API

A simple and clean RESTful API for an ecommerce application built with Express.js and Node.js.

## Features

- ✅ User authentication (Register & Login)
- ✅ User roles: Admin and Client
- ✅ Product management (CRUD operations)
- ✅ Order management with rating system
- ✅ JWT-based authentication
- ✅ Role-based access control

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
```

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"  // optional: "admin" or "client" (default: "client")
}
```

#### Register Admin
```
POST /api/auth/register-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users

All user endpoints require authentication (Bearer token).

#### Get Current User Profile
```
GET /api/users/me
Authorization: Bearer <token>
```

#### Get All Users (Admin Only)
```
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get User By ID
```
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"  // Only admin can change roles
}
```

#### Delete User (Admin Only)
```
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

### Products

#### Get All Products (Public)
```
GET /api/products
```

#### Get Product By ID (Public)
```
GET /api/products/:id
```

#### Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999.99,
  "stock": 50,
  "image": "https://example.com/laptop.jpg",
  "description": "High performance laptop"
}
```

#### Update Product (Admin Only)
```
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 899.99,
  "stock": 45,
  "description": "Updated description"
}
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

### Orders

All order endpoints require authentication (Bearer token).

#### Create Order (Client Only)
```
POST /api/orders
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2
    }
  ]
}
```

#### Get All Orders
```
GET /api/orders
Authorization: Bearer <token>
```
- Admin: Gets all orders
- Client: Gets only their own orders

#### Get Order By ID
```
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "delivered"  // Options: pending, processing, shipped, delivered, cancelled
}
```

#### Rate Order (Client Only)
```
POST /api/orders/:id/rate
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "rating": 5,  // 1-5
  "review": "Great product, fast delivery!"
}
```
**Note:** Can only rate delivered orders.

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned when you register or login.

## User Roles

- **Client**: Can create orders, rate orders, view their own orders
- **Admin**: Can manage products, users, and update order statuses

## Order Flow

1. Client creates an order → Status: `pending`
2. Admin updates status to `processing` → Stock is reduced
3. Admin updates status to `shipped`
4. Admin updates status to `delivered`
5. Client can now rate the order (1-5 stars)

If order is cancelled, stock is automatically restored.

## Project Structure

```
api/
├── config/
│   └── db.js           # Database connection
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js         # JWT authentication
│   └── roles.js        # Role authorization
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   └── protected.js
├── utils/
│   └── validators.js
├── server.js
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | No (default: 1d) |

## Testing with Postman

Import the Postman collection provided in the repository to test all endpoints. The collection includes:
- Pre-configured requests for all endpoints
- Automatic token management
- Example request bodies


## Author

ANoyer

