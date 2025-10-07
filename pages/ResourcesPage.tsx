import React from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ResourceVideo } from '../types';
import { useTranslation } from '../context/LanguageContext';

// Danh sách video nổi bật của Tim Vũ + bổ sung video phát triển bản thân
const defaultVideos: ResourceVideo[] = [
    {
        id: "Ico4Qh39hTE",
        videoId: "Ico4Qh39hTE",
        title: 'Khoa học về KỶ LUẬT (Bí mật cày "English" ✏️12h/ngày từ 2 A.M dù GHÉT)',
        description: 'Khám phá bí quyết kỷ luật bản thân để học tiếng Anh 12h/ngày, kể cả khi không thích. Video của Tim Vũ.',
    },
    {
        id: "RVo7NdzOdS0",
        videoId: "RVo7NdzOdS0",
        title: 'Ngủ ÍT được NHIỀU (khoa học MỚI)',
        description: 'Tim Vũ chia sẻ cách ngủ ít mà vẫn đạt hiệu quả cao, dựa trên các nghiên cứu khoa học mới.',
    },
    {
        id: "6_fqyOUmmFI",
        videoId: "6_fqyOUmmFI",
        title: 'Cách học như Thiên Tài – Part 1',
        description: 'Phương pháp học tập hiệu quả, tiếp cận như thiên tài, hướng dẫn bởi Tim Vũ.',
    },
    {
        id: "qG497ktbFvg",
        videoId: "qG497ktbFvg",
        title: '#25 – Nỗi đau TIẾNG ANH',
        description: 'Trải lòng về quá trình học tiếng Anh và những khó khăn thường gặp. Video của Tim Vũ.',
    },
    {
        id: "gIpZFLx8m20",
        videoId: "gIpZFLx8m20",
        title: '#17 – Best habits',
        description: 'Những thói quen tốt giúp phát triển bản thân, chia sẻ từ Tim Vũ.',
    },
    {
        id: "MJKTYIxfLoA",
        videoId: "MJKTYIxfLoA",
        title: '#26 – Mới lên ĐẠI HỌC',
        description: 'Lời khuyên cho sinh viên mới vào đại học, kinh nghiệm thực tế từ Tim Vũ.',
    },

    // Bổ sung video phát triển bản thân
    {
        id: "L5Nb1MTHxUI",
        videoId: "L5Nb1MTHxUI",
        title: "10 Habits for Self Improvement (Life Changing & Motivating)",
        description: "10 thói quen thay đổi và truyền cảm hứng cho sự phát triển bản thân.",
    },
    {
        id: "SmEyOALeEIg",
        videoId: "SmEyOALeEIg",
        title: "5 HABITS for Amazing Personal Growth! (1-hr Motivational class)",
        description: "5 thói quen giúp phát triển cá nhân vượt bậc. Lớp truyền cảm hứng dài 1 giờ.",
    },
    {
        id: "AWGayyX9I6o",
        videoId: "AWGayyX9I6o",
        title: "The 7 Essential Pillars of Personal Development | Brian Tracy",
        description: "7 trụ cột thiết yếu cho sự phát triển bản thân, trình bày bởi Brian Tracy.",
    },
    {
        id: "eaQyCMZTZX4",
        videoId: "eaQyCMZTZX4",
        title: "I AM WHAT I CHOOSE TO BECOME – Jim Rohn Motivation",
        description: "Jim Rohn truyền cảm hứng về lựa chọn và phát triển bản thân.",
    },
    {
        id: "SJTC9cV9260",
        videoId: "SJTC9cV9260",
        title: "What Fuels Self Improvement And Personal Development | Best Motivational Speech",
        description: "Tại sao chúng ta phát triển bản thân? Bài phát biểu truyền cảm hứng.",
    },
    {
        id: "53eMp3PKZ4g",
        videoId: "53eMp3PKZ4g",
        title: "Time To Let Go Of Your Thoughts | Nhat Nam Le",
        description: "Học cách buông bỏ suy nghĩ tiêu cực để phát triển bản thân.",
    },
    {
        id: "OWYU-zNKdh0",
        videoId: "OWYU-zNKdh0",
        title: "10 years of self-improvement knowledge in 14 minutes 52 seconds",
        description: "Tóm tắt 10 năm kiến thức phát triển bản thân trong gần 15 phút.",
    },
];

const ResourcesPage: React.FC = () => {
    const { t } = useTranslation();
    const [videos] = useLocalStorage<ResourceVideo[]>('resourceVideos', []);

    // Nếu videos rỗng thì dùng danh sách mặc định
    const renderedVideos = videos.length > 0 ? videos : defaultVideos;

    // Danh sách video hiển thị dạng link (giống phần đầu trang)
    const videoLinks = [
        {
            title: "10 Habits for Self Improvement (Life Changing & Motivating)",
            url: "https://www.youtube.com/watch?v=L5Nb1MTHxUI",
        },
        {
            title: "5 HABITS for Amazing Personal Growth! (1-hr Motivational class)",
            url: "https://www.youtube.com/watch?v=SmEyOALeEIg",
        },
        {
            title: "The 7 Essential Pillars of Personal Development | Brian Tracy",
            url: "https://m.youtube.com/watch?v=AWGayyX9I6o",
        },
        {
            title: "I AM WHAT I CHOOSE TO BECOME – Jim Rohn Motivation",
            url: "https://www.youtube.com/watch?v=eaQyCMZTZX4",
        },
        {
            title: "What Fuels Self Improvement And Personal Development | Best Motivational Speech",
            url: "https://www.youtube.com/watch?v=SJTC9cV9260",
        },
        {
            title: "Time To Let Go Of Your Thoughts | Nhat Nam Le",
            url: "https://www.youtube.com/watch?v=53eMp3PKZ4g",
        },
        {
            title: "10 years of self-improvement knowledge in 14 minutes 52 seconds",
            url: "https://www.youtube.com/watch?v=OWYU-zNKdh0",
        },
    ];

    return (
        <div>
            <PageTitle title={t('resources.title')} subtitle={t('resources.subtitle')} />
            
            <div className="mb-6 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80">
                <h2 className="text-xl font-bold mb-2">Dưới đây là một số video nổi bật của <span className="text-blue-700">Tim Vũ</span> & phát triển bản thân:</h2>
                <ul className="list-disc pl-6 text-slate-700">
                    {defaultVideos
                        .filter(video => video.id !== "iLANPST33Kc") // Loại bỏ "Cà phê cùng Tim Vũ"
                        .slice(0, 6) // Chỉ lấy các video Tim Vũ gốc
                        .map(video => (
                            <li key={video.id}>
                                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">{video.title}</a>
                            </li>
                        ))}
                    {/* Thêm các video phát triển bản thân */}
                    {videoLinks.map(link => (
                        <li key={link.url}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">{link.title}</a>
                        </li>
                    ))}
                </ul>
                <p className="mt-2 text-sm text-slate-500">Bạn muốn nhận <b>toàn bộ danh sách video</b> của Tim Vũ? Hãy nhắn cho chúng tôi!</p>
            </div>

            {renderedVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {renderedVideos
                        .filter(video => video.id !== "iLANPST33Kc") // Loại bỏ "Cà phê cùng Tim Vũ"
                        .map(video => (
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
