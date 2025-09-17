import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import type { ForumPost, ForumComment } from '../types';
import { TrashIcon, UserIcon } from '../components/icons/Icons';

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', []);
    const [post, setPost] = useState<ForumPost | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
            setPost(foundPost);
        }
    }, [postId, posts]);

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
            if (window.confirm(t('post.deletePostConfirm'))) {
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
             if (window.confirm(t('post.deleteCommentConfirm'))) {
                const updatedComments = post.comments.filter(c => c.id !== commentId);
                const updatedPost = { ...post, comments: updatedComments };
                setPost(updatedPost);
                setPosts(posts.map(p => p.id === postId ? updatedPost : p));
            }
        }
    };

    if (!post) {
        return <div className="text-center py-10">{t('post.notFound')}</div>;
    }

    const canDeletePost = user?.isAdmin || user?.id === post.authorId;

    return (
        <div>
            <Link to="/forum" className="text-blue-600 hover:underline mb-4 inline-block">&larr; {t('post.backToForum')}</Link>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-slate-200/80">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{post.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {t('forum.postBy', { author: post.authorEmail.split('@')[0], date: post.createdAt })}
                        </p>
                    </div>
                    {canDeletePost && (
                        <button onClick={handleDeletePost} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <hr className="my-6"/>
                <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">{t('post.commentsTitle', { count: post.comments.length })}</h2>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-6 border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('post.leaveComment')}</h3>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('post.commentPlaceholder')}
                        className="w-full h-24 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                        >
                            {t('post.postComment')}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md flex items-start gap-4 border border-slate-200/80">
                             <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-slate-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800">{comment.authorEmail.split('@')[0]}</p>
                                        <p className="text-xs text-slate-400">{comment.createdAt}</p>
                                    </div>
                                    {(user?.isAdmin || user?.id === comment.authorId) && (
                                        <button onClick={() => handleDeleteComment(comment.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-700 mt-2">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                    {post.comments.length === 0 && (
                        <p className="text-slate-500">{t('post.noComments')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;