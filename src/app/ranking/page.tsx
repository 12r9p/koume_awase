"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Ranking: React.FC = () => {
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await axios.post('/api/getRankings');
                setRankings(response.data);
            } catch (error) {
                console.error('ランキングの取得に失敗しました:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white">
                <div className="loader"></div><div className='text-black mx-8'>読み込み中...</div>
            </div>
        );
    }

    const getRankedData = (data: any[]) => {
        let rank = 1;
        let prevScore: any = null;
        return data.map((item, index) => {
            if (prevScore !== item.score) {
                rank = index + 1;
            }
            prevScore = item.score;
            return { ...item, rank };
        });
    };

    const rankedData = getRankedData(rankings);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-start p-4 pt-16">
            <div className="fixed top-0 left-0 right-0 bg-indigo-100 p-4 z-10">
                <button
                    onClick={() => router.push('/')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                    ホームに戻る
                </button>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-indigo-800 mt-8">ランキング</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">上位20位</h2>
                <ul className="list-none">
                    {rankedData.slice(0, 20).map((rank) => (
                        <li
                            key={rank.id}
                            className={`mb-4 p-4 rounded-lg ${rank.rank === 1 ? 'bg-gold text-black text-shadow-gold' :
                                rank.rank === 2 ? 'bg-silver text-black text-shadow-silver' :
                                    rank.rank === 3 ? 'bg-bronze text-black text-shadow-bronze' :
                                        'bg-gray-300 text-black'
                                }`}
                        >
                            <span className={`block ${rank.rank <= 3 ? 'text-3xl font-bold' : 'text-xl'}`}>
                                {rank.rank}. {rank.name}
                            </span>
                            <span className="block text-xl font-semibold">{rank.score}点</span>
                            <span className="block text-lg">{rank.kosen}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Ranking;