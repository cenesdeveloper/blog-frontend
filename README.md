# Blog Application – Frontend

> **Note:** The live demo may take up to 50 seconds to load initially due to server cold start on Render.

This is the **frontend** for the Blog Application, built with React. It communicates with the backend to provide a complete blogging platform with post creation, category/tag filtering, and draft management.

## 🚀 Features

- View all blog posts on the homepage
- Filter posts by **category** or **tag**
- View individual posts in detail
- **Create posts** (requires a category to be created first)
- Create, update, and delete categories and tags
- Manage draft posts
- Responsive design for desktop and mobile

## 📸 Screenshots



![Screenshot Placeholder](screenshot.png)

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
- Backend server running ([Backend Repo](BACKEND_REPO_LINK))

### Installation
```bash
# Clone the repository
git clone FRONTEND_REPO_LINK

cd frontend

# Install dependencies
npm install

# Start the development server
npm start

The app will run at:  

http://localhost:3000

### Environment Variables
Create a `.env` file in the `frontend` folder with:
REACT_APP_API_BASE_URL=http://localhost:8080
