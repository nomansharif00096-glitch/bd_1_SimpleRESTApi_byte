# Simple REST API - Product List

A simple REST API built with **NestJS**, **Prisma ORM**, and **PostgreSQL** for managing a product list. The API supports product CRUD operations, request validation, persistent database storage, and API rate limiting using **The Shield Protocol**.

## Internship Task

Build a REST API for a product list with the following requirements:

- Expose endpoints for Create, Read, Update, and Delete.
- Return all responses in JSON format.
- Use appropriate HTTP status codes.
- Persist data in a database or persistent store.
- Implement basic input validation and error responses.
- Add API rate limiting.
- Block users after more than 5 requests in 1 minute.
- Return this custom `429` response:

```json
{
  "statusCode": 429,
  "message": "Arithmatrix Security: DDOS attempt blocked."
}
```

## Tech Stack

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator
- class-transformer
- @nestjs/throttler

## Features

- Create a product.
- List all products.
- Get a single product by ID.
- Update a product by ID.
- Delete a product by ID.
- Validate request body data.
- Persist products in PostgreSQL.
- Apply global rate limiting.
- Return custom `429 Too Many Requests` response.

## Project Structure

```text
src/
  app.module.ts
  main.ts
  common/
    guards/
      custom-throttler.guard.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  products/
    dto/
      create-product.dto.ts
      update-product.dto.ts
    products.controller.ts
    products.module.ts
    products.service.ts

prisma/
  schema.prisma
  migrations/
```

## Installation

Install project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add your PostgreSQL connection strings.

Example:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/product_api"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:5433/product_api_shadow"
```

If you are using local Prisma Postgres with `prisma dev`, copy the connection strings printed by Prisma into `.env`.

## Database Setup

Start local Prisma Postgres:

```bash
npx prisma dev
```

If PowerShell blocks `npx`, use:

```bash
cmd /c npx prisma dev
```

Open another terminal and run the migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Optional: open Prisma Studio to view database records:

```bash
npx prisma studio
```

## Running the Project

Start the NestJS development server:

```bash
npm run start:dev
```

Base URL:

```text
http://localhost:3000
```

Products API URL:

```text
http://localhost:3000/products
```

## Product Model

```json
{
  "id": 1,
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 2500,
  "quantity": 10,
  "createdAt": "2026-09-04T15:50:39.000Z",
  "updatedAt": "2026-09-04T15:50:39.000Z"
}
```

## Validation Rules

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `name` | string | Yes | Must not be empty |
| `description` | string | No | Optional |
| `price` | number | Yes | Must be positive |
| `quantity` | integer | Yes | Must be `0` or greater |

## API Endpoints

| Method | Endpoint | Description | Success Status |
| --- | --- | --- | --- |
| `POST` | `/products` | Create a product | `201 Created` |
| `GET` | `/products` | List all products | `200 OK` |
| `GET` | `/products/:id` | Get one product by ID | `200 OK` |
| `PATCH` | `/products/:id` | Update one product by ID | `200 OK` |
| `DELETE` | `/products/:id` | Delete one product by ID | `200 OK` |

## Create Product

Endpoint:

```text
POST /products
```

Sample request:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Keyboard\",\"description\":\"Mechanical keyboard\",\"price\":2500,\"quantity\":10}"
```

Sample response:

```json
{
  "id": 1,
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 2500,
  "quantity": 10,
  "createdAt": "2026-09-04T15:50:39.000Z",
  "updatedAt": "2026-09-04T15:50:39.000Z"
}
```

## List Products

Endpoint:

```text
GET /products
```

Sample request:

```bash
curl http://localhost:3000/products
```

Sample response:

```json
[
  {
    "id": 1,
    "name": "Keyboard",
    "description": "Mechanical keyboard",
    "price": 2500,
    "quantity": 10,
    "createdAt": "2026-09-04T15:50:39.000Z",
    "updatedAt": "2026-09-04T15:50:39.000Z"
  }
]
```

If no products exist:

```json
[]
```

## Get Product By ID

Endpoint:

```text
GET /products/:id
```

Sample request:

```bash
curl http://localhost:3000/products/1
```

Sample response:

```json
{
  "id": 1,
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 2500,
  "quantity": 10,
  "createdAt": "2026-09-04T15:50:39.000Z",
  "updatedAt": "2026-09-04T15:50:39.000Z"
}
```

## Update Product

Endpoint:

```text
PATCH /products/:id
```

Sample request:

```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":2200,\"quantity\":8}"
```

Sample response:

```json
{
  "id": 1,
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 2200,
  "quantity": 8,
  "createdAt": "2026-09-04T15:50:39.000Z",
  "updatedAt": "2026-09-04T16:10:00.000Z"
}
```

## Delete Product

Endpoint:

```text
DELETE /products/:id
```

Sample request:

```bash
curl -X DELETE http://localhost:3000/products/1
```

Sample response:

```json
{
  "message": "Product delete successfully"
}
```

## Error Responses

Invalid product data returns `400 Bad Request`.

Example request:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"\",\"price\":-10,\"quantity\":-1}"
```

Sample response:

```json
{
  "message": [
    "name should not be empty",
    "price must be a positive number",
    "quantity must not be less than 0"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Invalid route parameter type returns `400 Bad Request`.

Example:

```text
GET /products/abc
```

Sample response:

```json
{
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request",
  "statusCode": 400
}
```

If a server or database operation fails, the API returns a JSON error response.

Example:

```json
{
  "message": "Failed to fetch products",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## The Shield Protocol - Rate Limiting

The API uses global rate limiting with `@nestjs/throttler`.

Limit:

```text
5 requests per 60 seconds
```

If a client sends more than 5 requests within 1 minute, the API returns:

```json
{
  "statusCode": 429,
  "message": "Arithmatrix Security: DDOS attempt blocked."
}
```

Test command:

```bash
curl http://localhost:3000/products
curl http://localhost:3000/products
curl http://localhost:3000/products
curl http://localhost:3000/products
curl http://localhost:3000/products
curl http://localhost:3000/products
```

The 6th request should return the custom `429` response.

## Available Scripts

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run lint
```

## Final Submission Checklist

- CRUD endpoints are available.
- Product data is stored in PostgreSQL.
- Prisma migration files are included.
- Request validation is enabled globally.
- JSON error responses are returned.
- The Shield Protocol rate limit is implemented.
- Custom `429` message is returned after the request limit is exceeded.
- API endpoint list and sample requests/responses are documented.

## Author

Internship project submission for **Simple REST API - Product List**.
