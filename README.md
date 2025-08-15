# Blog Application – Frontend

> **Note:** The live demo may take up to 50 seconds to load initially due to server cold start on Render.

> **Live Demo:** [Frontend](https://blog-frontend-green-five.vercel.app/)  
> **Repos:** This frontend (you are here) · [Backend Repo](https://github.com/cenesdeveloper/blog-backend)

This is the **frontend** for the Blog Application, built with React. It communicates with the backend to provide a complete blogging platform with post creation, category/tag filtering, and draft management.

## 🚀 Features

- View all blog posts on the homepage
- Filter posts by **category** or **tag**
- View individual posts in detail
- **Create posts** (requires a category to be created first)
- Get, create, and delete categories and tags
- Manage draft posts
- Responsive design for desktop and mobile


## 📸 Screenshots

<img width="2087" height="721" alt="image" src="https://github.com/user-attachments/assets/597561dc-5b53-4e54-9613-f74cd0593198" />

## 🛠 Tech Stack

- **Frontend:** React, React Router
- **Styling:** CSS
- **API Calls:** Axios (REST API)

## 📂 Project Structure

```plaintext
frontend/
├── public/         # Static assets
├── src/
│   ├── features/   # Feature modules (posts, categories, tags, auth)
│   ├── shared/     # Shared components (Header, etc.)
│   ├── App.js      # Main application routes
│   └── index.js    # Entry point
``` 
## ⚙️ Getting Started

### Prerequisites
- Node.js (>= 16)
- npm or yarn
- Backend server running ([Backend Repo](https://github.com/cenesdeveloper/blog-backend))

### Installation
```bash
# Clone the repository
git clone FRONTEND_REPO_LINK

cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```
The app will run locally at:  
http://localhost:3000  

Make sure the backend is running (see backend repo for setup).  
This frontend uses `vercel.json` to proxy API calls to the backend.  
If your backend URL changes, update the `"dest"` field in `vercel.json`.
