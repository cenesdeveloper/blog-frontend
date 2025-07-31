import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import MainPage from "./features/posts/MainPage";
import CreatePostPage from "./features/posts/CreatePostPage";
import CategoryPage from "./features/categories/CategoryPage";
import PostDetailPage from "./features/posts/PostDetailPage";
import TagPage from "./features/tags/TagsPage";

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
                {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                <Routes>
                    {!isLoggedIn ? (
                        <Route path="*" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
                    ) : (
                        <>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/create" element={<CreatePostPage />} />
                            <Route path="/categories" element={<CategoryPage />} />
                            <Route path="/posts/:id" element={<PostDetailPage />} />
                            <Route path="/tags" element={<TagPage />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
