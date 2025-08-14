const BASE_URL = "/api/v1";

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
};
