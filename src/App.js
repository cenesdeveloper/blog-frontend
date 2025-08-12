import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import MainPage from "./features/posts/MainPage";
import CreatePostPage from "./features/posts/CreatePostPage";
import CategoryPage from "./features/categories/CategoryPage";
import PostDetailPage from "./features/posts/PostDetailPage";
import TagPage from "./features/tags/TagsPage";
import DraftPostsPage from "./features/posts/DraftPostsPage";
import RegisterPage from "./features/auth/RegisterPage";
import ViewPostPage from "./features/posts/ViewPostPage";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiresAt = localStorage.getItem("expiresAt");
        const isValid = token && expiresAt && Date.now() < Number(expiresAt);
        setIsLoggedIn(isValid);
        if (!isValid) localStorage.clear();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (

        <Router>
            <div>
                <Routes>
                    {!isLoggedIn ? (
                        <>
                            <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<MainPage onLogout={handleLogout} />} />
                            <Route path="/create" element={<CreatePostPage onLogout={handleLogout} />} />
                            <Route path="/categories" element={<CategoryPage onLogout={handleLogout} />} />
                            <Route path="/posts/:id" element={<PostDetailPage onLogout={handleLogout} />} />
                            <Route path="/tags" element={<TagPage onLogout={handleLogout} />} />
                            <Route path="/drafts" element={<DraftPostsPage onLogout={handleLogout} />} />
                            <Route path="/view/:id" element={<ViewPostPage onLogout={handleLogout} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>

);
}

export default App;
