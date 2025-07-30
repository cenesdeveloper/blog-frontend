import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <CategoryPage />
                </>
            ) : (
                <LoginPage onLogin={() => setIsLoggedIn(true)} />
            )}
        </div>
    );
}

export default App;
