import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import type { ForumPost, User, ChatSession, ResourceVideo, NatureSound, KnowledgeDocument } from '../types';
import { TrashIcon, BotIcon } from '../components/icons/Icons';

const extractYouTubeID = (urlOrId: string): string => {
    if (urlOrId.length === 11) return urlOrId; // It's likely an ID already
    try {
        const url = new URL(urlOrId);
        if (url.hostname === 'youtu.be') {
            return url.pathname.slice(1);
        }
        if (url.hostname.includes('youtube.com')) {
            const videoId = url.searchParams.get('v');
            if (videoId) return videoId;
        }
    } catch (error) {
        // Not a valid URL, return original string
    }
    return urlOrId;
};


const AdminPage: React.FC = () => {
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
            alert("You cannot delete your own admin account.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete user ${emailToDelete}? This action cannot be undone.`)) {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
            delete storedUsers[emailToDelete];
            localStorage.setItem('users', JSON.stringify(storedUsers));
            setUsers(users.filter(u => u.email !== emailToDelete));
        }
    };
    
    const handleDeletePost = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post and all its comments?')) {
            setPosts(posts.filter(p => p.id !== postId));
        }
    };
    
    const handleAddResource = () => {
        const videoId = extractYouTubeID(newResourceUrl);
        if (!newResourceTitle.trim() || !videoId) {
            alert('Title and a valid YouTube URL/ID are required.');
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
            alert('Name and a valid YouTube URL/ID are required.');
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
            alert('Title and content are required.');
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
        if (window.confirm('Are you sure you want to delete this knowledge document?')) {
            setKnowledgeDocs(prev => prev.filter(doc => doc.id !== id));
        }
    };


    const TabButton = ({ tabName, label }: { tabName: string, label: string }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === tabName
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <UserManagementTab users={users} adminUser={adminUser} onDelete={handleDeleteUser} />;
            case 'posts': return <ForumManagementTab posts={posts} onDelete={handleDeletePost} />;
            case 'chats': return <ChatLogsTab sessions={chatSessions} onSelectSession={setSelectedSession} />;
            case 'resources': return (
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
                />
            );
            case 'sounds': return (
                <NatureSoundsManagementTab
                    sounds={natureSounds}
                    onDelete={handleDeleteSound}
                    onAdd={handleAddSound}
                    name={newSoundName}
                    setName={setNewSoundName}
                    url={newSoundUrl}
                    setUrl={setNewSoundUrl}
                />
            );
             case 'knowledge': return (
                <KnowledgeManagementTab
                    documents={knowledgeDocs}
                    onDelete={handleDeleteKnowledge}
                    onAdd={handleAddKnowledge}
                    title={newKnowledgeTitle}
                    setTitle={setNewKnowledgeTitle}
                    content={newKnowledgeContent}
                    setContent={setNewKnowledgeContent}
                />
            );
            default: return null;
        }
    };

    return (
        <div>
            <PageTitle title="Admin Panel" subtitle="Manage application settings and users." />

            <div className="flex space-x-2 mb-6 border-b overflow-x-auto pb-2">
                <TabButton tabName="users" label="Users" />
                <TabButton tabName="posts" label="Forum" />
                <TabButton tabName="chats" label="Chatbot Logs" />
                <TabButton tabName="knowledge" label="Chatbot Knowledge" />
                <TabButton tabName="resources" label="Resources" />
                <TabButton tabName="sounds" label="Nature Sounds" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                {renderContent()}
            </div>

            {selectedSession && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSession(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Chat Transcript</h2>
                        <p className="text-sm text-gray-500 mb-4">User: {selectedSession.userEmail} | Session: {new Date(selectedSession.sessionId).toLocaleString()}</p>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 border p-4 rounded-md">
                            {selectedSession.messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <BotIcon className="w-5 h-5 text-teal-600"/>
                                        </div>
                                    )}
                                    <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setSelectedSession(null)} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// Sub-components for each tab for better organization

const UserManagementTab: React.FC<{ users: User[], adminUser: User | null, onDelete: (email: string) => void }> = ({ users, adminUser, onDelete }) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Users ({users.length})</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.isAdmin ? 'Admin' : 'User'}</td>
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

const ForumManagementTab: React.FC<{ posts: ForumPost[], onDelete: (id: string) => void }> = ({ posts, onDelete }) => (
     <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Forum Posts ({posts.length})</h3>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.authorEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.createdAt}</td>
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

const ChatLogsTab: React.FC<{ sessions: ChatSession[], onSelectSession: (session: ChatSession) => void }> = ({ sessions, onSelectSession }) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Chat Sessions ({sessions.length})</h3>
        <div className="space-y-2">
            {sessions.slice().reverse().map(session => (
                <div key={session.sessionId} onClick={() => onSelectSession(session)} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <p className="font-semibold text-gray-800">{session.userEmail}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(session.sessionId).toLocaleString()} - {session.messages.length} messages
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const ResourceManagementTab: React.FC<{ videos: ResourceVideo[], onDelete: (id: string) => void, onAdd: () => void, title: string, setTitle: Function, description: string, setDescription: Function, url: string, setUrl: Function }> = (props) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Resource Videos</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">Add New Video</h4>
            <input type="text" placeholder="Video Title" value={props.title} onChange={e => props.setTitle(e.target.value)} className="w-full p-2 border rounded-md"/>
            <textarea placeholder="Video Description" value={props.description} onChange={e => props.setDescription(e.target.value)} className="w-full p-2 border rounded-md" rows={3}/>
            <input type="text" placeholder="YouTube URL or Video ID" value={props.url} onChange={e => props.setUrl(e.target.value)} className="w-full p-2 border rounded-md"/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">Add Resource</button>
        </div>
        <div className="space-y-3">
            {props.videos.map(video => (
                <div key={video.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-sm text-gray-500">{video.videoId}</p>
                    </div>
                    <button onClick={() => props.onDelete(video.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
    </div>
);

const NatureSoundsManagementTab: React.FC<{ sounds: NatureSound[], onDelete: (id: string) => void, onAdd: () => void, name: string, setName: Function, url: string, setUrl: Function }> = (props) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Nature Sounds</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">Add New Sound</h4>
            <input type="text" placeholder="Sound Name / Title" value={props.name} onChange={e => props.setName(e.target.value)} className="w-full p-2 border rounded-md"/>
            <input type="text" placeholder="YouTube URL or Video ID" value={props.url} onChange={e => props.setUrl(e.target.value)} className="w-full p-2 border rounded-md"/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">Add Sound</button>
        </div>
        <div className="space-y-3">
            {props.sounds.map(sound => (
                <div key={sound.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{sound.name}</p>
                         <p className="text-sm text-gray-500">{sound.videoId}</p>
                    </div>
                    <button onClick={() => props.onDelete(sound.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
    </div>
);

const KnowledgeManagementTab: React.FC<{ documents: KnowledgeDocument[], onDelete: (id: string) => void, onAdd: () => void, title: string, setTitle: Function, content: string, setContent: Function }> = (props) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Chatbot Knowledge Base</h3>
        <div className="border p-4 rounded-md mb-6 space-y-3">
            <h4 className="font-semibold">Add New Document</h4>
            <input type="text" placeholder="Document Title" value={props.title} onChange={e => props.setTitle(e.target.value)} className="w-full p-2 border rounded-md"/>
            <textarea placeholder="Document Content..." value={props.content} onChange={e => props.setContent(e.target.value)} className="w-full p-2 border rounded-md" rows={6}/>
            <button onClick={props.onAdd} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">Add Document</button>
        </div>
        <div className="space-y-3">
            {props.documents.map(doc => (
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
