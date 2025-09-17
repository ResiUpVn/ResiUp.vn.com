// FIX: Replaced placeholder content with the correct component implementation to resolve module loading errors.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import type { ForumPost, ForumComment } from '../types';
import PageTitle from '../components/PageTitle';
import { TrashIcon, UserIcon } from '../components/icons/Icons';

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', []);
    const [post, setPost] = useState<ForumPost | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
            setPost(foundPost);
        } else {
            // Optional: navigate away if post not found
            // navigate('/forum'); 
        }
    }, [postId, posts, navigate]);

    const handleAddComment = () => {
        if (!newComment.trim() || !user || !post) return;

        const comment: ForumComment = {
            id: new Date().toISOString(),
            content: newComment,
            authorEmail: user.email,
            authorId: user.id,
            createdAt: new Date().toLocaleString(),
        };

        const updatedPost = { ...post, comments: [...post.comments, comment] };
        setPost(updatedPost);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        setNewComment('');
    };

    const handleDeletePost = () => {
        if (!user || !post) return;
        if (user.isAdmin || user.id === post.authorId) {
            if (window.confirm('Are you sure you want to delete this post and all its comments?')) {
                setPosts(posts.filter(p => p.id !== postId));
                navigate('/forum');
            }
        }
    };
    
    const handleDeleteComment = (commentId: string) => {
        if (!user || !post) return;
        const commentToDelete = post.comments.find(c => c.id === commentId);
        if (!commentToDelete) return;

        if (user.isAdmin || user.id === commentToDelete.authorId) {
             if (window.confirm('Are you sure you want to delete this comment?')) {
                const updatedComments = post.comments.filter(c => c.id !== commentId);
                const updatedPost = { ...post, comments: updatedComments };
                setPost(updatedPost);
                setPosts(posts.map(p => p.id === postId ? updatedPost : p));
            }
        }
    };


    if (!post) {
        return <div className="text-center py-10">Post not found or is loading...</div>;
    }

    const canDeletePost = user?.isAdmin || user?.id === post.authorId;

    return (
        <div>
            <Link to="/forum" className="text-teal-600 hover:underline mb-4 inline-block">&larr; Back to Forum</Link>
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            By {post.authorEmail.split('@')[0]} on {post.createdAt}
                        </p>
                    </div>
                    {canDeletePost && (
                        <button onClick={handleDeletePost} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <hr className="my-6"/>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Comments ({post.comments.length})</h2>
                
                {/* Add comment form */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave a comment</h3>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>

                {/* Comments list */}
                <div className="space-y-4">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{comment.authorEmail.split('@')[0]}</p>
                                        <p className="text-xs text-gray-400">{comment.createdAt}</p>
                                    </div>
                                    {(user?.isAdmin || user?.id === comment.authorId) && (
                                        <button onClick={() => handleDeleteComment(comment.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-700 mt-2">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                    {post.comments.length === 0 && (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;