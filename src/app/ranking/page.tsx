// src/app/ranking/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ランキングコンポーネントの定義
const Ranking: React.FC = () => {
    // ランキングデータを保持するstate
    const [rankings, setRankings] = useState<any[]>([]);
    // ローディング状態を管理するstate
    const [loading, setLoading] = useState(true);
    // ルーターの初期化
    const router = useRouter();

    useEffect(() => {
        // ランキングデータを取得する非同期関数
        const fetchRankings = async () => {
            try {
                // APIからランキングデータを取得
                const response = await axios.post('/api/getRankings');
                // 取得したデータをstateにセット
                setRankings(response.data);
            } catch (error) {
                console.error('ランキングの取得に失敗しました:', error);
            } finally {
                // データ取得完了後、ローディング状態を解除
                setLoading(false);
            }
        };

        // コンポーネントマウント時にランキングデータを取得
        fetchRankings();
    }, []);

    // ローディング中の表示
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white">
                <div className="loader">読み込み中...</div>
            </div>
        );
    }

    // ランキングデータを順位付けする関数
    const getRankedData = (data: any[]) => {
        let rank = 1;
        let prevScore :any = null;
        return data.map((item, index) => {
            if (prevScore !== item.score) {
                rank = index + 1;
            }
            prevScore = item.score;
            return { ...item, rank };
        });
    };

    // ランキングデータを順位付け
    const rankedData = getRankedData(rankings);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
            {/* ホームに戻るボタン */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
                ホームに戻る
            </button>

            <h1 className="text-4xl font-bold mb-6 text-indigo-800">ランキング</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">上位10位</h2>
                <ul className="list-none">
                    {/* 上位10位のデータを表示 */}
                    {rankedData.slice(0, 10).map((rank) => (
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