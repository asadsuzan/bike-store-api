### Bike Store API - Assignment 2

This project is a RESTful API built with Express and TypeScript to manage a bike store. It uses MongoDB with Mongoose for data storage and retrieval.

### Features

#### CRUD Operations for Bikes:

- Create new bikes
- Get a list of all bikes
- Get a specific bike by ID
- Update an existing bike
- Delete a bike

#### Order Management:

- Place orders for bikes
- Inventory management - updates quantity and stock status
- Handles insufficient stock scenarios
- Order Revenue Calculation:
- Calculates total revenue from all orders

### Getting Started

This project requires Node.js and npm to be installed on your system.

1. Clone this repository:

```bash
git clone https://github.com/asadsuzan/bike-store-api.git
```

2.  Navigate to the project directory:

```bash
cd bike-store-api-assingment-2
```

3. Install dependencies:`

```Bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```json
PORT = 5000
DB_URI=<Your MongoDB Connection URI>
```

### Running the API

`Start the development server:`

```Bash
npm run dev
```

This will start the server on port 5000 by default. You can check the server status at http://localhost:5000/health

### Deployment

The Bike Store API is deployed and live on Vercel, making it accessible for testing and integration. Use the following base URL to access the API:

##### Base URL:

https://bike-store-api.vercel.app

Live API Endpoints:
Health Check:
Endpoint: /health
Method: GET

- Example Request:

```javascript
curl https://bike-store-api.vercel.app/health

```

- Response:

```javascript
{
    "message": "Server is up and running!",
    "success": true
}
```

### API Documentation

The API uses standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations. Refer to the specific endpoints below for details on request body formats and expected responses.

### Inventory :

Create a Bike {POST}: `/api/products`

```code
// Request Body:
{
    "name": "Xtreme Mountain Bike",
    "brand": "Giant",
    "price": 1200,
    "category": "Mountain",
    "description": "A high-performance bike built for    tough terrains.",
    "quantity": 50,
    "inStock": true
  },

//  Response: Success message and created bike details

{
    "message": "Bike created successfully",
    "success": true,
    "data": {
        "name": "Xtreme Mountain Bike",
        "brand": "Giant",
        "price": 1200,
        "category": "Mountain",
        "description": "A high-performance bike built for tough terrains.",
        "quantity": 50,
        "inStock": true,
        "isDeleted": false,
        "_id": "674345ae91ea4f89e9cf522a",
        "createdAt": "2024-11-24T15:26:38.272Z",
        "updatedAt": "2024-11-24T15:26:38.272Z",
        "__v": 0
    }
}
```

Get All Bikes (GET) `/api/products`:

```javascript

// Response: Success message and products list
{
    "message": "'Bikes retrieved successfully'",
    "success": true,
    "data": [
        {
            "_id": "674345ae91ea4f89e9cf522a",
            "name": "Xtreme Mountain Bike",
            "brand": "Giant",
            "price": 1200,
            "category": "Mountain",
            "description": "A high-performance bike built for tough terrains.",
            "quantity": 50,
            "inStock": true,
            "isDeleted": false,
            "createdAt": "2024-11-24T15:26:38.272Z",
            "updatedAt": "2024-11-24T15:26:38.272Z",
            "__v": 0
        },
        // rest doc...

        ]
        }
```

Get filtered Bikes (GET) `/api/products?searchTerm=Xtreme`:

##### Optional Query Param: `searchTerm` (string) - filter bikes by `name`, `brand`, or `category`

```javascript
// Response: List of filtered bikes
{
    "message": "Bikes retrieved successfully for searchTerm: Xtreme",
    "success": true,
    "data": [
        {
            "_id": "674345ae91ea4f89e9cf522a",
            "name": "Xtreme Mountain Bike",
            "brand": "Giant",
            "price": 1200,
            "category": "Mountain",
            "description": "A high-performance bike built for tough terrains.",
            "quantity": 50,
            "inStock": true,
            "isDeleted": false,
            "createdAt": "2024-11-24T15:26:38.272Z",
            "updatedAt": "2024-11-24T15:26:38.272Z",
            "__v": 0
        },
          // rest doc if matched...
    ]
}
```

Get a Specific Bike ( GET) `/api/products/:productId:

Path Param: productId (string) - `ID` of the bike

```javascript
// Response: Details of the specific bike
{
    "message": "Bike Retrieves successfully for id: 674345ae91ea4f89e9cf522a",
    "success": true,
    "data": {
        "_id": "674345ae91ea4f89e9cf522a",
        "name": "Xtreme Mountain Bike",
        "brand": "Giant",
        "price": 1200,
        "category": "Mountain",
        "description": "A high-performance bike built for tough terrains.",
        "quantity": 50,
        "inStock": true,
        "isDeleted": false,
        "createdAt": "2024-11-24T15:26:38.272Z",
        "updatedAt": "2024-11-24T15:26:38.272Z",
        "__v": 0
    }
}
```

Update a Bike (PUT) `/api/products/:productId`

Path Param: `productId` - `ID `of the bike

```javascript
//Request Body:
{
    "name": "Performance Road Bike",
    "brand": "Cervelo",
    rest as need..
}
// Response: Success message and updated bike details
{
    "message": "Bike updated successfully",
    "success": true,
    "data": {
        "_id": "674345ae91ea4f89e9cf522a",
        "name": "Performance Road Bike",
        "brand": "Cervelo",
        "price": 1200,
        "category": "Mountain",
        "description": "A high-performance bike built for tough terrains.",
        "quantity": 50,
        "inStock": true,
        "isDeleted": false,
        "createdAt": "2024-11-24T15:26:38.272Z",
        "updatedAt": "2024-11-24T16:09:32.274Z",
        "__v": 0
    }
}
```

Delete a Bike (DELETE ) `/api/products/:productId`:

Path Param: productId (string) - ID of the bike
Response: Success message confirming deletion

```javascript
// Response: Success message
{
    "message": "Bike deleted successfully",
    "success": true,
    "data": {}
}
```

### Orders:

Place an Order (POST) `/api/orders`:

```javascript
// Request Body:
{
  "email": "customer@example.com",
  "product": "674346a891ea4f89e9cf5230",
  "quantity": 2,
  "totalPrice": 5000
}
// Response: Success message confirming order creation
{
    "message": "Order created successfully",
    "success": true,
    "data": {
        "email": "customer@example.com",
        "product": "674346a891ea4f89e9cf5230",
        "quantity": 2,
        "totalPrice": 5000,
        "_id": "674351945d128547ad3fbf89",
        "createdAt": "2024-11-24T16:17:24.253Z",
        "updatedAt": "2024-11-24T16:17:24.253Z",
        "__v": 0
    }
}

```

Calculate Revenue from Orders (GET) `/api/orders/revenue`:

```javascript
// Response: Total revenue from all orders
{
    "message": "Revenue calculated successfully",
    "success": true,
    "data": {
        "totalRevenue": 5000
    }
}
```

#### Error Handling

The API uses standard HTTP status codes to indicate success or failure. In case of errors, the response will include an error message and details about the issue.
