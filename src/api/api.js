export const loginUser = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json(); // contains token, expiresAt
};

export const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/v1/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
};
