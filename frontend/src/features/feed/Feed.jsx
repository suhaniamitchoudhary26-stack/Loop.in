import React, { useEffect, useState } from 'react';
import { fetchPosts } from './feed.api';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data);
            } catch (err) {
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) return <div>Loading feed...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Student Feed</h2>
            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                backgroundColor: '#fff'
                            }}
                        >
                            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
                            <p style={{ color: '#555' }}>{post.content}</p>
                            <div style={{ fontSize: '0.85em', color: '#888', marginTop: '10px' }}>
                                Posted by: <strong>{post.author_name}</strong>
                                {post.is_anonymous && <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>(Anonymous)</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;
