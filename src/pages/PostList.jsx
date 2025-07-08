import React, { useEffect, useState } from "react";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/posts")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: 700, margin: "40px auto", padding: 20, background: "#fafafa", borderRadius: 12 }}>
            <h1>All Posts</h1>
            {posts.length === 0 ? (
                <div>No posts found.</div>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} style={{ padding: 16, borderBottom: "1px solid #e2e2e2" }}>
                            <h2>{post.title}</h2>
                            <p>{post.summary}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostList;
