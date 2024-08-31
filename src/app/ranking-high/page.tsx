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
                const response = await axios.post('/api/getRankings-high');
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-black">
                <div className="loader"></div><div className='text-white mx-8'>高難易度ランキング読み込み中...</div>
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
        <div className="min-h-screen bg-gradient-to-b from-red-900 to-black flex flex-col items-center justify-center p-4">
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
                ホームに戻る
            </button>

            <h1 className="text-4xl font-bold mb-6 text-red-500 animate-pulse">高難易度モードランキング</h1>
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto border-2 border-red-500">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">上位20位 - エリートプレイヤー</h2>
                <ul className="list-none">
                    {rankedData.slice(0, 20).map((rank) => (
                        <li
                            key={rank.id}
                            className={`mb-4 p-4 rounded-lg ${rank.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                                    rank.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                                        rank.rank === 3 ? 'bg-gradient-to-r from-orange-300 to-orange-500 text-black' :
                                            'bg-gray-800 text-white'
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