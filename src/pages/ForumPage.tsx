import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import type { ForumPost } from '../types';

const ForumPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
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
            <PageTitle title={t('forum.title')} subtitle={t('forum.subtitle')} />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    {t('forum.createPost')}
                </button>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('forum.discussions')}</h3>
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Link to={`/forum/${post.id}`} key={post.id} className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                <h4 className="text-lg font-bold text-blue-700">{post.title}</h4>
                                <p className="text-sm text-slate-500">
                                    {t('forum.postBy', { author: post.authorEmail.split('@')[0], date: post.createdAt })}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-8">{t('forum.noPosts')}</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('forum.modal.title')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="post-title" className="block text-sm font-medium text-slate-700">{t('forum.modal.postTitle')}</label>
                                <input
                                    id="post-title"
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="post-content" className="block text-sm font-medium text-slate-700">{t('forum.modal.content')}</label>
                                <textarea
                                    id="post-content"
                                    rows={6}
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                {t('forum.modal.cancel')}
                            </button>
                            <button
                                onClick={handleCreatePost}
                                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                            >
                                {t('forum.modal.post')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumPage;
