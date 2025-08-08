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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 text-red-700 text-sm p-3 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                </label>
                <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    id="password"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white
                   shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
                Login
            </button>
        </form>
    );
}

export default LoginForm;
