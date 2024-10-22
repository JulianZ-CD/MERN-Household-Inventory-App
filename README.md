# Inventory Management System

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to manage recipes and inventory items.

## Features

### User Authentication
- User registration and login
- JWT (JSON Web Tokens) authentication
- Protected routes and user sessions

### Recipe Management
- Create, read, update, and delete recipes
- Save/unsave other users' recipes
- Owner-only edit and delete permissions
- Recipe details include:
  - Name
  - Description
  - Ingredients list
  - Cooking instructions
  - Cooking time
  - Image URL

### Inventory Management
- Create, read, update, and delete inventory items
- Owner-only access control
- Track expiration dates
- Inventory details include:
  - Name
  - Description
  - Ingredients list
  - Instructions (optional)
  - Image URL
  - Expiry date

## Technologies Used

### Frontend
- React.js with Hooks
- React Router for navigation
- Axios for HTTP requests
- React Cookie for session management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Frontend Setup
```bash

# Navigate to server and client directory
cd client

# Install dependencies
npm install

<!--
# Create .env file and add:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
-->

# Start client
yarn start
```

### Backend Setup

Create another terminal

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server
yarn start
```
