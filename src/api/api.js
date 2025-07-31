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

export const fetchTags = async () => {
    const res = await fetch("http://localhost:8080/api/v1/tags");
    if (!res.ok) throw new Error("Failed to fetch tags");
    return res.json();
};

export const fetchPosts = async (categoryId, tagId) => {
    let url = "http://localhost:8080/api/v1/posts";
    const params = [];
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (tagId) params.push(`tagId=${tagId}`);
    if (params.length > 0) url += `?${params.join("&")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};
