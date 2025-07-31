import { useEffect, useState } from "react";

function TagPage() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchTags = () => {
        fetch("http://localhost:8080/api/v1/tags")
            .then(res => res.json())
            .then(setTags)
            .catch(() => setError("Failed to load tags"));
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/v1/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ names: [newTag] }),
        });

        if (res.ok) {
            setNewTag("");
            setSuccess("Tag created successfully");
            fetchTags();
        } else {
            const data = await res.json();
            setError(data.message || "Failed to create tag");
        }
    };

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!window.confirm("Are you sure you want to delete this tag?")) return;

        const res = await fetch(`http://localhost:8080/api/v1/tags/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setSuccess("Tag deleted");
            fetchTags();
        } else {
            const data = await res.json();
            setError(data.message || "Failed to delete tag");
        }
    };

    return (
        <div>
            <h2>Manage Tags</h2>

            <form onSubmit={handleCreate}>
                <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="New Tag Name"
                    required
                />
                <button type="submit">Add Tag</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <ul>
                {tags.map((tag) => (
                    <li key={tag.id}>
                        {tag.name}
                        <button onClick={() => handleDelete(tag.id)} style={{ marginLeft: "10px" }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TagPage;
