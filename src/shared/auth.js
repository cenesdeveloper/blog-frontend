// src/shared/auth.js
export function parseJwt(token) {
    if (!token) return {};
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return {};
    }
}

export function getCurrentUserId() {
    const token = localStorage.getItem("token");
    const p = parseJwt(token);
    return p.userId || p.id || p.sub || p.uid || null;
}

export function getCurrentUserEmail() {
    const token = localStorage.getItem("token");
    const p = parseJwt(token);
    return p.email || p.sub || null;
}
