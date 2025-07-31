import { useEffect, useState } from "react";

function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("PUBLISHED");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState([]);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/categories")
            .then(res => res.json())
            .then(setCategories)
            .catch(console.error);

        fetch("http://localhost:8080/api/v1/tags")
            .then(res => res.json())
            .then(setTags)
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Not authenticated");
            return;
        }

        const postData = {
            title,
            content,
            status,      // ✅ added status field
            categoryId,
            tagIds,
        };

        try {
            const res = await fetch("http://localhost:8080/api/v1/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!res.ok) throw new Error("Failed to create post");

            setTitle("");
            setContent("");
            setStatus("PUBLISHED");
            setCategoryId("");
            setTagIds([]);
            setSuccess("Post created successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleTag = (tagId) => {
        setTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <div>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <br />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />
                <br />

                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                </select>
                <br />

                <label>Category:</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">-- Select a category --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <br />

                <label>Tags:</label>
                <div>
                    {tags.map((tag) => (
                        <label key={tag.id} style={{ marginRight: "10px" }}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={tagIds.includes(tag.id)}
                                onChange={() => toggleTag(tag.id)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                <br />
                <button type="submit">Create Post</button>
            </form>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default CreatePostPage;
