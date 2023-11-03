# e-commerce-service

This project is the backend side to the e-commerce portfolio project. It returns the products available for purchase. It uses fake data retrieved from https://fakestoreapi.com.

## Database

### Prerequisites

- The project requires a pre-running PostgreSQL database.

Create an `.env` file in the main project folder with the following environment variables:

```
PGUSER=""
PGPASSWORD=""
PGDATABASE=""

ACCESS_TOKEN_SECRET=""
ACCESS_TOKEN_EXPIRY_TIME=""
REFRESH_TOKEN_EXPIRY_TIME=""

CLIENT_URL=""
```

Create tables and seed them by running:

```
node ./src/db-init.js
```

Update database by running:

```
node ./src/db-update.js
```

## Available Scripts

In the project directory, you can run:

```
npm dev
```

Runs the app in the development mode on port 5000.

## Technologies Used

- Node
- Express
