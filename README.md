# 🌱 PlantsCare Server

This is the backend server for the **PlantsCare** application, built with **Express.js** and connected to **MongoDB Atlas**. It handles CRUD operations for plant data and supports user-specific queries, sorting, and more.

## 🚀 Features

- 🔧 Built with **Express.js**
- 🌐 CORS-enabled API for frontend access
- 📦 RESTful CRUD operations for plants
- 📂 MongoDB database with Mongoose driver
- 🔐 Secure configuration using `.env`
- 🧩 Sorting and filtering with MongoDB aggregation
- ⚡ Lightweight and easy to deploy

---
## 🧪 API Endpoints

| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | `/`                | Health check endpoint |
| POST   | `/addPlant`        | Add a new plant |
| GET    | `/plant`           | Get plants by user email (`?emailParams=user@example.com`) |
| GET    | `/allPlant`        | Get all plants sorted by `careLevel` |
| GET    | `/latestPlant`     | Get the 6 most recently added plants |
| GET    | `/plant/:id`       | Get a single plant by its MongoDB `_id` |
| PUT    | `/plant/:id`       | Update a plant by ID |
| DELETE | `/plant/:id`       | Delete a plant by ID |

---

## 📦 Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
PORT=3000
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

```

## 🧩 Technologies Used

- **Node.js** – JavaScript runtime  
- **Express** – Web framework  
- **MongoDB** – NoSQL database  
- **MongoDB Node.js Driver** – For database interactions  
- **dotenv** – For environment variable management  
- **CORS** – To handle cross-origin requests  

