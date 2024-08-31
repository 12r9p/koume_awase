"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Github } from 'lucide-react';
import Switch from '@/components/ui/switch';

const Home: React.FC = () => {
  const [isHighDifficulty, setIsHighDifficulty] = useState(false);

  const handleDifficultyToggle = () => {
    setIsHighDifficulty(!isHighDifficulty);
  };

  const backgroundClass = isHighDifficulty
    ? "bg-gradient-to-b from-red-200 to-red-100"
    : "bg-gradient-to-b from-indigo-100 to-white";

  return (
    <div className={`min-h-screen ${backgroundClass} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      <Head>
        <title>コウメ合わせ - ホーム</title>
        <meta name="description" content="コウメ太夫の世界観を当てよう！" />
        <link rel="icon" href="/koume.png" type="image/png" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">コウメ合わせ</h1>
        <p className="mb-8 text-lg text-gray-700">コウメ太夫の世界観を当てよう！</p>

        <div className="flex items-center justify-center mb-6">
          <span className="mr-2 text-black">難易度：</span>
          <Switch
            checked={isHighDifficulty}
            onCheckedChange={handleDifficultyToggle}
          />
          <span className="ml-2 text-black">{isHighDifficulty ? '高' : '通常'}</span>
        </div>

        <Link href={isHighDifficulty ? "/high-difficult" : "/game"} passHref>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            ゲームを始める
          </button>
        </Link>

        <div className="mt-8">
          <Link href={isHighDifficulty ? "/ranking-high" : "/ranking"}passHref>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
              ランキングを見る
            </button>
          </Link>
        </div>

        <div className="mt-12 bg-white p-7 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-800">ゲームルール</h2>
          <ul className="text-left text-gray-700 list-disc list-inside">
            <li>音が出るよ！気をつけてね</li>
            <li>1回のゲームで5問出題されます。</li>
            <li>各問題で1つの上の句と2択の下の句選択肢が表示されます。</li>
            <li>正しい下の句を選んでください。</li>
            <li>制限時間は1問あたり17秒です。</li>
            <li>正解すると10点獲得、早く答えるとボーナス点（最大5点）が加算されます。</li>
          </ul>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500">
        <a
          href="https://github.com/12r9p/koume_awase"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <Github size={24} className="mr-2" />
          GitHubでソースコードを見る
        </a>
        <p>システム作成：茨城高専ラジオ　佐藤匠</p>
        <p>問題データ作成：茨城高専ラジオ　蛭田泰誠</p>
        <p>MIDI音源作成：茨城高専デジタルアーツ　鶴岡煌基</p>
      </footer>
    </div>
  );
};

export default Home