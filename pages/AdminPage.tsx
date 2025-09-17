import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import type { ForumPost, User, ChatSession, ResourceVideo, NatureSound, KnowledgeDocument } from '../types';
import { TrashIcon, BotIcon } from '../components/icons/Icons';

const extractYouTubeID = (urlOrId: string): string => {
    if (!urlOrId) return '';
    if (urlOrId.length === 11 && !urlOrId.includes('.')) return urlOrId;
    try {
        const url = new URL(urlOrId);
        if (url.hostname === 'youtu.be') {
            return url.pathname.slice(1);
        }
        if (url.hostname.includes('youtube.com')) {
            const videoId = url.searchParams.get('v');
            if (videoId) return videoId;
        }
    } catch (error) {}
    return '';
};


const AdminPage: React.FC = () => {
    const { t } = useTranslation();
    const { user: adminUser } = useAuth();
    const [activeTab, setActiveTab] = useState('users');

    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', []);
    const [chatSessions] = useLocalStorage<ChatSession[]>('chatSessions', []);
    const [resourceVideos, setResourceVideos] = useLocalStorage<ResourceVideo[]>('resourceVideos', []);
    const [natureSounds, setNatureSounds] = useLocalStorage<NatureSound[]>('natureSounds', []);
    const [knowledgeDocs, setKnowledgeDocs] = useLocalStorage<KnowledgeDocument[]>('chatbotKnowledge', []);

    // Form states
    const [newResourceTitle, setNewResourceTitle] = useState('');
    const [newResourceDesc, setNewResourceDesc] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');
    const [newSoundName, setNewSoundName] = useState('');
    const [newSoundUrl, setNewSoundUrl] = useState('');
    const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('');
    const [newKnowledgeContent, setNewKnowledgeContent] = useState('');

    // Modal state
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        const userArray = Object.values(storedUsers) as User[];
        setUsers(userArray);
    }, []);

    const handleDeleteUser = (emailToDelete: string) => {
        if (emailToDelete === adminUser?.email) {
            alert(t('admin.users.deleteSelfError'));
            return;
        }
        if (window.confirm(t('admin.users.deleteConfirm', { email: emailToDelete }))) {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
            delete storedUsers[emailToDelete];
            localStorage.setItem('users', JSON.stringify(storedUsers));
            setUsers(users.filter(u => u.email !== emailToDelete));
        }
    };
    
    const handleDeletePost = (postId: string) => {
        if (window.confirm(t('admin.forum.deleteConfirm'))) {
            setPosts(posts.filter(p => p.id !== postId));
        }
    };
    
    const handleAddResource = () => {
        const videoId = extractYouTubeID(newResourceUrl);
        if (!newResourceTitle.trim() || !videoId) {
            alert(t('admin.resources.addError'));
            return;
        }
        const newVideo: ResourceVideo = {
            id: new Date().toISOString(),
            title: newResourceTitle,
            description: newResourceDesc,
            videoId: videoId,
        };
        setResourceVideos(prev => [newVideo, ...prev]);
        setNewResourceTitle('');
        setNewResourceDesc('');
        setNewResourceUrl('');
    };

    const handleDeleteResource = (id: string) => {
        setResourceVideos(prev => prev.filter(v => v.id !== id));
    };
    
    const handleAddSound = () => {
        const videoId = extractYouTubeID(newSoundUrl);
        if (!newSoundName.trim() || !videoId) {
            alert(t('admin.sounds.addError'));
            return;
        }
        const newSound: NatureSound = {
            id: new Date().toISOString(),
            name: newSoundName,
            videoId: videoId,
        };
        setNatureSounds(prev => [newSound, ...prev]);
        setNewSoundName('');
        setNewSoundUrl('');
    };
    
    const handleDeleteSound = (id: string) => {
        setNatureSounds(prev => prev.filter(s => s.id !== id));
    };

    const handleAddKnowledge = () => {
        if (!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()) {
            alert(t('admin.knowledge.addError'));
            return;
        }
        const newDoc: KnowledgeDocument = {
            id: new Date().toISOString(),
            title: newKnowledgeTitle,
            content: newKnowledgeContent,
        };
        setKnowledgeDocs(prev => [newDoc, ...prev]);
        setNewKnowledgeTitle('');
        setNewKnowledgeContent('');
    };
    
    const handleDeleteKnowledge = (id: string) => {
        if (window.confirm(t('admin.knowledge.deleteConfirm'))) {
            setKnowledgeDocs(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const tabs = [
        { name: 'users', label: t('admin.tabs.users') },
        { name: 'posts', label: t('admin.tabs.forum') },
        { name: 'chats', label: t('admin.tabs.chatLogs') },
        { name: 'knowledge', label: t('admin.tabs.chatKnowledge') },
        { name: 'resources', label: t('admin.tabs.resources') },
        { name: 'sounds', label: t('admin.tabs.sounds') },
    ];
    
    const TabButton = ({ tabName, label }: { tabName: string, label: string }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tabName
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <PageTitle title={t('admin.title')} subtitle={t('admin.subtitle')} />

            <div className="flex space-x-2 mb-6 border-b border-slate-200 overflow-x-auto pb-2">
                {tabs.map(tab => <TabButton key={tab.name} tabName={tab.name} label={tab.label} />)}
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80">
                {/* Content is rendered here based on activeTab */}
                {activeTab === 'users' && <UserManagementTab users={users} adminUser={adminUser} onDelete={handleDeleteUser} t={t} />}
                {activeTab === 'posts' && <ForumManagementTab posts={posts} onDelete={handleDeletePost} t={t} />}
                {activeTab === 'chats' && <ChatLogsTab sessions={chatSessions} onSelectSession={setSelectedSession} t={t} />}
                {activeTab === 'resources' && (
                    <ResourceManagementTab
                        videos={resourceVideos}
                        onDelete={handleDeleteResource}
                        onAdd={handleAddResource}
                        title={newResourceTitle}
                        setTitle={setNewResourceTitle}
                        description={newResourceDesc}
                        setDescription={setNewResourceDesc}
                        url={newResourceUrl}
                        setUrl={setNewResourceUrl}
                        t={t}
                    />
                )}
                {activeTab === 'sounds' && (
                    <NatureSoundsManagementTab
                        sounds={natureSounds}
                        onDelete={handleDeleteSound}
                        onAdd={handleAddSound}
                        name={newSoundName}
                        setName={setNewSoundName}
                        url={newSoundUrl}
                        setUrl={setNewSoundUrl}
                        t={t}
                    />
                )}
                {activeTab === 'knowledge' && (
                    <KnowledgeManagementTab
                        documents={knowledgeDocs}
                        onDelete={handleDeleteKnowledge}
                        onAdd={handleAddKnowledge}
                        title={newKnowledgeTitle}
                        setTitle={setNewKnowledgeTitle}
                        content={newKnowledgeContent}
                        setContent={setNewKnowledgeContent}
                        t={t}
                    />
                )}
            </div>

            {selectedSession && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSession(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('admin.chatLogs.transcriptTitle')}</h2>
                        <p className="text-sm text-slate-500 mb-4">{t('admin.chatLogs.transcriptInfo', { email: selectedSession.userEmail, date: new Date(selectedSession.sessionId).toLocaleString() })}</p>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 border p-4 rounded-md">
                            {selectedSession.messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <BotIcon className="w-5 h-5 text-blue-600"/>
                                        </div>
                                    )}
                                    <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setSelectedSession(null)} className="px-5 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">{t('admin.chatLogs.close')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components for each tab for better organization
const UserManagementTab = ({ users, adminUser, onDelete, t }: any) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('admin.users.title', { count: users.length })}</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.users.email')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.users.role')}</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('admin.users.delete')}</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {users.map((u: User) => (
                        <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.isAdmin ? t('admin.users.admin') : t('admin.users.user')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onDelete(u.email)} className="text-red-600 hover:text-red-900" disabled={u.email === adminUser?.email}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ForumManagementTab = ({ posts, onDelete, t }: any) => (
     <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('admin.forum.title', { count: posts.length })}</h3>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.forum.postTitle')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.forum.author')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('admin.forum.createdAt')}</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('admin.forum.delete')}</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {posts.map((post: ForumPost) => (
                        <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{post.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{post.authorEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{post.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onDelete(post.id)} className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ChatLogsTab = ({ sessions, onSelectSession, t }: any) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('admin.chatLogs.title', { count: sessions.length })}</h3>
        <div className="space-y-2">
            {sessions.slice().reverse().map((session: ChatSession) => (
                <div key={session.sessionId} onClick={() => onSelectSession(session)} className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer">
                    <p className="font-semibold text-slate-800">{session.userEmail}</p>
                    <p className="text-sm text-slate-500">
                        {new Date(session.sessionId).toLocaleString()} - {t('admin.chatLogs.messages', { count: session.messages.length })}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const ResourceManagementTab = (props: any) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{props.t('admin.resources.title')}</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">{props.t('admin.resources.addTitle')}</h4>
            <input type="text" placeholder={props.t('admin.resources.videoTitle')} value={props.title} onChange={(e: any) => props.setTitle(e.target.value)} className="w-full p-2 border rounded-md"/>
            <textarea placeholder={props.t('admin.resources.description')} value={props.description} onChange={(e: any) => props.setDescription(e.target.value)} className="w-full p-2 border rounded-md" rows={3}/>
            <input type="text" placeholder={props.t('admin.resources.url')} value={props.url} onChange={(e: any) => props.setUrl(e.target.value)} className="w-full p-2 border rounded-md"/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">{props.t('admin.resources.addButton')}</button>
        </div>
        <div className="space-y-3">
            {props.videos.map((video: ResourceVideo) => (
                <div key={video.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-sm text-slate-500">{video.videoId}</p>
                    </div>
                    <button onClick={() => props.onDelete(video.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
    </div>
);

const NatureSoundsManagementTab = (props: any) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{props.t('admin.sounds.title')}</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">{props.t('admin.sounds.addTitle')}</h4>
            <input type="text" placeholder={props.t('admin.sounds.name')} value={props.name} onChange={(e: any) => props.setName(e.target.value)} className="w-full p-2 border rounded-md"/>
            <input type="text" placeholder={props.t('admin.sounds.url')} value={props.url} onChange={(e: any) => props.setUrl(e.target.value)} className="w-full p-2 border rounded-md"/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">{props.t('admin.sounds.addButton')}</button>
        </div>
        <div className="space-y-3">
            {props.sounds.map((sound: NatureSound) => (
                <div key={sound.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{sound.name}</p>
                         <p className="text-sm text-slate-500">{sound.videoId}</p>
                    </div>
                    <button onClick={() => props.onDelete(sound.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
    </div>
);

const KnowledgeManagementTab = (props: any) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{props.t('admin.knowledge.title')}</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">{props.t('admin.knowledge.addTitle')}</h4>
            <input type="text" placeholder={props.t('admin.knowledge.docTitle')} value={props.title} onChange={(e: any) => props.setTitle(e.target.value)} className="w-full p-2 border rounded-md"/>
            <textarea placeholder={props.t('admin.knowledge.content')} value={props.content} onChange={(e: any) => props.setContent(e.target.value)} className="w-full p-2 border rounded-md" rows={6}/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">{props.t('admin.knowledge.addButton')}</button>
        </div>
        <div className="space-y-3">
            {props.documents.map((doc: KnowledgeDocument) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{doc.title}</p>
                    </div>
                    <button onClick={() => props.onDelete(doc.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
    </div>
);

export default AdminPage;