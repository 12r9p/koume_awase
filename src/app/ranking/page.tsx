'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface RankingEntry {
    rank: number;
    name: string;
    score: number;
}

const Ranking: React.FC = () => {
    const [rankings, setRankings] = useState<RankingEntry[]>([]);
    const [playerRank, setPlayerRank] = useState<number | null>(null);
    const searchParams = useSearchParams();

    // クエリパラメータを安全に取得
    const score = searchParams.get('score') || undefined;
    const name = searchParams.get('name') || undefined;

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch('/api/notion');
                if (response.ok) {
                    const data = await response.json();
                    setRankings(data);
                    if (score && name) {
                        const rank = data.findIndex((entry: RankingEntry) =>
                            entry.name === name && entry.score === Number(score)
                        ) + 1;
                        setPlayerRank(rank);
                    }
                } else {
                    console.error('Failed to fetch rankings');
                }
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        };

        fetchRankings();
    }, [score, name]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-6 text-indigo-800">ランキング</h1>
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">順位</th>
                            <th className="px-4 py-2">名前</th>
                            <th className="px-4 py-2">スコア</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.slice(0, 10).map((entry, index) => (
                            <tr key={index} className={`${entry.rank === playerRank ? 'bg-yellow-200' : ''}`}>
                                <td className="border px-4 py-2">{entry.rank}</td>
                                <td className="border px-4 py-2">{entry.name}</td>
                                <td className="border px-4 py-2">{entry.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {playerRank && playerRank > 10 && (
                    <div className="mt-4">
                        <p>あなたの順位: {playerRank}位</p>
                        <p>名前: {name}</p>
                        <p>スコア: {score}</p>
                    </div>
                )}
            </div>
            <Link href="/" passHref>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full mt-4 transition duration-300 ease-in-out transform hover:scale-105">
                    ホームに戻る
                </button>
            </Link>
        </div>
    );
};

export default Ranking;
