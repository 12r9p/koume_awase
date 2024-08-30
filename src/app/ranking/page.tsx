// src/app/ranking/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Ranking: React.FC = () => {
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter();

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await axios.post('/api/getRankings'); // POSTリクエストに変更
                setRankings(response.data);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white">
                <div className="loader">Loading...</div> {/* Display a spinner */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
            <button
                onClick={() => router.push('/')} // ホームに戻るボタン
                className="absolute top-4 left-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
                ホームに戻る
            </button>

            <h1 className="text-4xl font-bold mb-6 text-indigo-800">ランキング</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">上位10位</h2>
                <ul className="list-none"> {/* list-noneを追加してマーカーを取り除く */}
                    {rankings.slice(0, 10).map((rank, index) => (
                        <li
                            key={rank.id}
                            className={`mb-4 p-4 rounded-lg ${index === 0 ? 'bg-gold text-white text-shadow-gold' : ''} ${index === 1 ? 'bg-silver text-white text-shadow-silver' : ''
                                } ${index === 2 ? 'bg-bronze text-white text-shadow-bronze' : ''} ${index > 2 ? 'bg-gray-300 text-black' : ''
                                }`}
                        >
                            <span className={`block ${index <= 2 ? 'text-3xl font-bold' : 'text-xl'}`}>
                                {index + 1}. {rank.name}
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
