import { useState } from "react";
import { loginUser } from "../../api/api";

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await loginUser(email, password);
            const expiresAt = Date.now() + data.expiresIn * 1000;
            localStorage.setItem("token", data.token);
            localStorage.setItem("expiresAt", expiresAt);
            onLogin();
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default LoginForm;
