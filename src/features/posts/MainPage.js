import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editFields, setEditFields] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/categories").then(res => res.json()).then(setCategories);
        fetch("http://localhost:8080/api/v1/tags").then(res => res.json()).then(setTags);
    }, []);

    useEffect(() => {
        let url = "http://localhost:8080/api/v1/posts";
        const params = [];
        if (selectedCategory) params.push(`categoryId=${selectedCategory}`);
        if (selectedTag) params.push(`tagId=${selectedTag}`);
        if (params.length > 0) url += "?" + params.join("&");

        fetch(url)
            .then(res => res.json())
            .then(setPosts);
    }, [selectedCategory, selectedTag]);

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const handleEdit = (post) => {
        setEditingPostId(post.id);
        setEditFields({
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            categoryId: post.category?.id,
            tagIds: post.tags.map(t => t.id)
        });
    };

    const handleUpdate = async (id) => {
        console.log("Sending update payload:", editFields);

        if (!editFields.categoryId) {
            alert("Please select a category before updating.");
            return;
        }

        const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editFields)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Update failed:", errorText);
            alert(`Failed to update post: ${res.status} - ${errorText}`);
            return;
        }

        setEditingPostId(null);

        // Refresh posts
        let url = "http://localhost:8080/api/v1/posts";
        fetch(url).then(res => res.json()).then(setPosts);
    };


    const toggleTag = (tagId) => {
        setEditFields((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId]
        }));
    };

    return (
        <div>
            <h2>Blog Homepage</h2>

            <button onClick={() => navigate("/create")}>Create Post</button>
            <button onClick={() => navigate("/categories")} style={{ marginLeft: "10px" }}>
                Manage Categories
            </button>
            <button onClick={() => navigate("/tags")}>Manage Tags</button>

            <div>
                <h4>Filter by Category:</h4>
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                        {cat.name}
                    </button>
                ))}
                <button onClick={() => setSelectedCategory(null)}>Clear</button>
            </div>

            <div>
                <h4>Filter by Tag:</h4>
                {tags.map(tag => (
                    <button key={tag.id} onClick={() => setSelectedTag(tag.id)}>
                        {tag.name}
                    </button>
                ))}
                <button onClick={() => setSelectedTag(null)}>Clear</button>
            </div>

            <div>
                <h3>Posts</h3>
                {posts.map(post => (
                    <div key={post.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                        {editingPostId === post.id ? (
                            <>
                                <input
                                    value={editFields.title}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, title: e.target.value }))}
                                />
                                <textarea
                                    value={editFields.content}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, content: e.target.value }))}
                                />
                                <select
                                    value={editFields.status}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, status: e.target.value.toUpperCase() }))}
                                >
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                                <select
                                    value={editFields.categoryId || ""}
                                    onChange={(e) => setEditFields(prev => ({ ...prev, categoryId: e.target.value }))}
                                >
                                    <option value="">-- Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <div>
                                    {tags.map(tag => (
                                        <label key={tag.id} style={{ marginRight: "10px" }}>
                                            <input
                                                type="checkbox"
                                                checked={editFields.tagIds.includes(tag.id)}
                                                onChange={() => toggleTag(tag.id)}
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                </div>
                                <button onClick={() => handleUpdate(post.id)}>Save</button>
                                <button onClick={() => setEditingPostId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h4
                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                >
                                    {post.title}
                                </h4>

                                <p>{post.content}</p>
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                                <button onClick={() => handleEdit(post)} style={{ marginLeft: "10px" }}>Update</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
