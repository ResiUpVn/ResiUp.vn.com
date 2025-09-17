import React from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ResourceVideo } from '../types';

const ResourcesPage: React.FC = () => {
    const [videos] = useLocalStorage<ResourceVideo[]>('resourceVideos', []);

    return (
        <div>
            <PageTitle title="Wellness Resources" subtitle="A curated library of helpful articles, videos, and tools." />
            
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(video => (
                        <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                             <div className="aspect-w-16 aspect-h-9">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.title}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-800">{video.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 flex-1">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <h3 className="text-2xl font-semibold text-gray-700">No Resources Available</h3>
                    <p className="mt-2 text-gray-500">The admin has not added any resources yet. Please check back later.</p>
                </div>
            )}
             <style>
                {`
                    .aspect-w-16 {
                        position: relative;
                        padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    }
                    .aspect-h-9 {
                        height: 0;
                    }
                    .aspect-w-16 > iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                `}
            </style>
        </div>
    );
};

export default ResourcesPage;
