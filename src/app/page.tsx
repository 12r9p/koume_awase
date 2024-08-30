import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>カルタゲーム - ホーム</title>
        <meta name="description" content="オンラインカルタゲームへようこそ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">コウメ合わせ</h1>
        <p className="mb-8 text-lg text-gray-700">コウメ太夫の世界観を当てよう！</p>

        <Link href="/game" passHref>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            ゲームを始める
          </button>
        </Link>

        <div className="mt-12 bg-white p-7 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-800">ゲームルール</h2>
          <ul className="text-left text-gray-700 list-disc list-inside">
            <li>1回のゲームで10問出題されます。</li>
            <li>各問題で1つの上の句と4つの下の句選択肢が表示されます。</li>
            <li>正しい下の句を選んでください。</li>
            <li>制限時間は1問あたり15秒です。</li>
            <li>正解すると10点獲得、早く答えるとボーナス点（最大5点）が加算されます。</li>
            <li>全問終了後に総合得点が表示されます。</li>
          </ul>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; 2024 コウメ合わせ All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;