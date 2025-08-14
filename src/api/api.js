export const loginUser = async (email, password) => {
    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json(); // contains token, expiresAt
};

export const fetchCategories = async () => {
    const res = await fetch("/api/v1/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
};

export const fetchTags = async () => {
    const res = await fetch("/api/v1/tags");
    if (!res.ok) throw new Error("Failed to fetch tags");
    return res.json();
};

export const fetchPosts = async (categoryId, tagId) => {
    let url = "/api/v1/posts";
    const params = [];
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (tagId) params.push(`tagId=${tagId}`);
    if (params.length > 0) url += `?${params.join("&")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};

export async function registerUser(name, email, password, matchingPassword) {
    const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, matchingPassword }),
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
        let msg = `Registration failed (${res.status})`;
        if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => null);
            msg = data?.message || Object.values(data || {})[0] || msg;
        } else {
            const text = await res.text().catch(() => "");
            if (text) msg = text;
        }
        throw new Error(msg);
    }

    if (res.status === 204) return null;
    if (contentType.includes("application/json")) {
        return await res.json();
    }
    return null;
}

