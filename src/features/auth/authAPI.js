import { fetchWithAuth } from "../../shared/apiClient";

export const loginUser = async (email, password) => {
    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json(); // { token, expiresAt }
};
