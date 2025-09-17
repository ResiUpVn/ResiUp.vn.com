import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import type { ForumPost } from '../types';

const ForumPage: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    const handleCreatePost = () => {
        if (!newPostTitle.trim() || !newPostContent.trim() || !user) return;

        const newPost: ForumPost = {
            id: new Date().toISOString(),
            title: newPostTitle,
            content: newPostContent,
            authorEmail: user.email,
            authorId: user.id,
            createdAt: new Date().toLocaleString(),
            comments: [],
        };

        setPosts([newPost, ...posts]);
        setNewPostTitle('');
        setNewPostContent('');
        setIsModalOpen(false);
    };

    return (
        <div>
            <PageTitle title="Community Forum" subtitle="Connect with others on a similar journey." />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                >
                    Create New Post
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Discussions</h3>
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Link to={`/forum/${post.id}`} key={post.id} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <h4 className="text-lg font-bold text-teal-700">{post.title}</h4>
                                <p className="text-sm text-gray-500">
                                    By {post.authorEmail.split('@')[0]} on {post.createdAt}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">No posts yet. Be the first to start a discussion!</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    id="post-title"
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    id="post-content"
                                    rows={6}
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePost}
                                className="px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumPage;
