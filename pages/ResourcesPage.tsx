import React from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ResourceVideo } from '../types';
import { useTranslation } from '../context/LanguageContext';

const ResourcesPage: React.FC = () => {
    const { t } = useTranslation();
    const [videos] = useLocalStorage<ResourceVideo[]>('resourceVideos', []);

    return (
        <div>
            <PageTitle title={t('resources.title')} subtitle={t('resources.subtitle')} />
            
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(video => (
                        <div key={video.id} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200/80">
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
                                <h3 className="text-lg font-bold text-slate-800">{video.title}</h3>
                                <p className="mt-2 text-sm text-slate-600 flex-1">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md text-center border border-slate-200/80">
                    <h3 className="text-2xl font-semibold text-slate-700">{t('resources.noResourcesTitle')}</h3>
                    <p className="mt-2 text-slate-500">{t('resources.noResourcesDesc')}</p>
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