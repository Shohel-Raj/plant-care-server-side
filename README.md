# 🌱 PlantsCare Server

This is the backend server for the **PlantsCare** application, built with **Express.js** and connected to **MongoDB Atlas** using the native MongoDB driver. It powers the plant management, blog system, and community Q&A features.

---

## 🚀 Features

- ⚙️ Built with **Express.js**
- 🌍 **CORS-enabled** API for frontend integration
- 🌱 **CRUD operations** for plant data
- 📖 Blog system with full post support
- ❓ Q&A Forum for community engagement
- 📈 Category-wise and growth statistics
- 🔐 Environment-based secure configuration
- 💡 Clean and modular API structure

---

## 📦 Technologies Used

- **Node.js** – JavaScript runtime  
- **Express** – Web framework  
- **MongoDB Atlas** – Cloud NoSQL database  
- **MongoDB Node.js Driver** – For database access  
- **dotenv** – For managing environment variables  
- **CORS** – Enables cross-origin requests  

---

## 🌐 API Endpoints

### 🔄 General
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | `/`              | Server health check        |

---

### 🌿 Plant Management
| Method | Endpoint               | Description                                             |
|--------|------------------------|---------------------------------------------------------|
| POST   | `/addPlant`            | Add a new plant                                         |
| GET    | `/plant?emailParams=`  | Get plants added by a specific user                    |
| GET    | `/allPlant?order=asc`  | Get all plants sorted by care level (asc/desc)         |
| GET    | `/latestPlant`         | Get the 8 most recently added plants                   |
| GET    | `/plant/:id`           | Get a single plant by MongoDB `_id`                    |
| PUT    | `/plant/:id`           | Update a plant by ID                                   |
| DELETE | `/plant/:id`           | Delete a plant by ID                                   |
| GET    | `/category-count`      | Get number of plants per category                      |

---

### 📖 Blog System
| Method | Endpoint               | Description                                |
|--------|------------------------|--------------------------------------------|
| GET    | `/blogs`               | Get all blog posts                         |
| GET    | `/blogsHome`           | Get 8 latest blog posts (homepage preview) |
| GET    | `/blog/:id`            | Get single blog post by ID                 |
| GET    | `/blog-category-count` | Get number of blogs per category           |

---

### ❓ Community Q&A
| Method | Endpoint                     | Description                                |
|--------|------------------------------|--------------------------------------------|
| GET    | `/questions`                 | Get all community questions (latest first) |
| POST   | `/questions`                 | Post a new question                        |
| POST   | `/questions/:id/answer`      | Submit an answer to a question             |

---

### 📊 Statistics
| Method | Endpoint             | Description                                         |
|--------|----------------------|-----------------------------------------------------|
| GET    | `/stats?email=...`   | Get total and growth stats (global or per-user)    |

---

## ⚙️ Environment Variables

Create a `.env` file in your root directory with the following:

```env
PORT=3000
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password


## ✅ Future Suggestions

- 🔒 Add user authentication with Firebase/Auth0  
- 🛡 Add rate limiting and input validation  
- 🧪 Write unit tests using Jest or Supertest  
- 🚀 Add deployment guide (Render, Railway, Vercel serverless functions)  

---

## 📬 Contact

Created by [Mohammed Shohel RaJ](https://github.com/Shohel-Raj)  
🔗 Feel free to fork, clone, or contribute!
