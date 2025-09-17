// FIX: Replaced placeholder content with the correct component implementation to resolve module loading errors.
import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { NatureSound } from '../types';

const defaultSounds: NatureSound[] = [
    { id: '1', name: 'ASMR Ambience | Mưa rơi trên cánh đồng trà xanh Jeju', videoId: '2hFvRr3nLSI' },
    { id: '2', name: 'ASMR Thiên Nhiên – Tiếng Mưa Trên Dù & Thác Nước Trong Rừng Thông', videoId: 'Dx86JGMrZqI' },
    { id: '3', name: 'Một buổi sáng thức dậy trong rừng | Âm thanh thiên nhiên ASMR', videoId: 'JN6hIkizP18' },
    { id: '4', name: 'Relaxing camp in the beach / Cắm trại biển Hải Hòa', videoId: 'T9KFzC1PQjw' },
    { id: '5', name: 'Relaxing Nature Sounds – 4 Hours Meditative ASMR', videoId: 'ZVwENdOOjnM' },
    { id: '6', name: 'Natural Forest Sounds – ASMR | Our Green Planet | BBC Earth', videoId: 'cnTf2UxjGW8' },
];

const NatureSoundsPage: React.FC = () => {
    const [sounds] = useLocalStorage<NatureSound[]>('natureSounds', defaultSounds);
    const [selectedVideo, setSelectedVideo] = useState<NatureSound | null>(null);

    useEffect(() => {
        if (sounds.length > 0 && !selectedVideo) {
            setSelectedVideo(sounds[0]);
        }
    }, [sounds, selectedVideo]);

    if (sounds.length === 0) {
        return (
             <div>
                <PageTitle title="Nature Sounds" subtitle="Choose a video to relax, focus, or meditate." />
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <h3 className="text-2xl font-semibold text-gray-700">No Sounds Available</h3>
                    <p className="mt-2 text-gray-500">The admin has not added any nature sounds yet. Please check back later.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <PageTitle title="Nature Sounds" subtitle="Choose a video to relax, focus, or meditate." />
            
            {selectedVideo && (
                <div className="mb-8">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-lg">
                        <iframe 
                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&loop=1&playlist=${selectedVideo.videoId}`}
                            title={selectedVideo.name}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <h3 className="text-xl font-bold mt-4 text-gray-800">{selectedVideo.name}</h3>
                </div>
            )}

            <h4 className="text-lg font-semibold text-gray-700 mb-4">Choose another sound</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sounds.map((sound) => (
                    <div
                        key={sound.videoId}
                        onClick={() => setSelectedVideo(sound)}
                        className="cursor-pointer group relative rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <img 
                            src={`https://img.youtube.com/vi/${sound.videoId}/mqdefault.jpg`} 
                            alt={sound.name} 
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className={`absolute inset-0 flex items-center justify-center p-4 text-center transition-colors ${selectedVideo?.videoId === sound.videoId ? 'bg-black/50' : 'bg-black/30 group-hover:bg-black/50'}`}>
                            <h3 className="text-white text-lg font-semibold">{sound.name}</h3>
                        </div>
                         {selectedVideo?.videoId === sound.videoId && (
                            <div className="absolute top-3 right-3 bg-teal-500 text-white px-2 py-1 text-xs rounded-full">
                                Playing
                            </div>
                        )}
                    </div>
                ))}
            </div>
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

export default NatureSoundsPage;