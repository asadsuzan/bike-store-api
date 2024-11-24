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

`Clone this repository:`

```Bash
git clone https://github.com/asadsuzan/bike-store-api.git
```

`Navigate to the project directory:`

```Bash
cd bike-store-api-assingment-2
```

`Install dependencies:`

```Bash
npm install
```

`Environment Variables`

Create a `.env` file in the root directory and configure the following variables:

```env
PORT = 5000
DB_URI=<Your MongoDB Connection URI>
```

`Running the API`

Start the development server:

```Bash
npm run dev
```

This will start the server on port 5000 by default. You can check the server status at http://localhost:5000/health

`Production Mode:`

Build the project for production:

```Bash
npm run build
```

Run the production server:

```Bash
npm start
```

### API Documentation

The API uses standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations. Refer to the specific endpoints below for details on request body formats and expected responses.

#### Bikes:

Create a Bike {POST}: `/api/products`

Request Body:

```JAVASCRIPT
{
  name: string;
  brand: string;
  price: number;
  category: BikeCategory;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted: boolean;
}
  Response: Success message and created bike details
```

Get All Bikes (GET) `/api/products`:

##### Optional Query Param: `searchTerm` (string) - filter bikes by `name`, `brand`, or `category`

Response: List of all bikes with details

Get a Specific Bike ( GET) `/api/products/:productId:`

```javascript
Path Param: productId (string) - ID of the bike
Response: Details of the specific bike
```

Update a Bike (PUT) `/api/products/:productId`:

```javascript
Path Param: productId (string) - ID of the bike
Request Body: Bike details to update (e.g., price, quantity)
Response: Success message and updated bike details
```

Delete a Bike (DELETE ) `/api/products/:productId`:

```javascript
Path Param: productId (string) - ID of the bike
Response: Success message confirming deletion
```

Orders:

Place an Order (POST) `/api/orders`:

Request Body:

```javascript
{

  email: string;
  product: ObjectId;
  quantity: number;
  totalPrice: number;

}
Response: Success message confirming order creation
```

Calculate Revenue from Orders (GET) `/api/orders/revenue`:

```javascript
Response: Total revenue from all orders
```

#### Error Handling

The API uses standard HTTP status codes to indicate success or failure. In case of errors, the response will include an error message and details about the issue.
