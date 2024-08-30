import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>コウメ合わせ - ホーム</title>
        <meta name="description" content="コウメ太夫の世界観を当てよう！" />
        <link rel="icon" href="/koume.png" type="image/png" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">コウメ合わせ</h1>
        <p className="mb-8 text-lg text-gray-700">コウメ太夫の世界観を当てよう！</p>

        <Link href="/game" passHref>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            ゲームを始める
          </button>
        </Link>
        <Link href="/ranking" passHref>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 ml-4">
            ランキングを見る
          </button>
        </Link>

        <div className="mt-12 bg-white p-7 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-800">ゲームルール</h2>
          <ul className="text-left text-gray-700 list-disc list-inside">
            <li>1回のゲームで5問出題されます。</li>
            <li>各問題で1つの上の句と難易度に応じた個数の下の句選択肢が表示されます。</li>
            <li>正しい下の句を選んでください。</li>
            <li>制限時間は1問あたり17秒です。</li>
            <li>正解すると10点獲得、早く答えるとボーナス点（最大5点）が加算されます。</li>
            <li>全問終了後に総合得点が表示されます。</li>
          </ul>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500">
        <p>ゲーム作成：茨城高専ラジオ　佐藤匠</p>
        <p>問題データ作成：茨城高専ラジオ　蛭田泰誠</p>
        <p>MIDI音源作成：茨城高専デジタルアーツ　鶴岡煌基</p>
      </footer>
    </div>
  );
};

export default Home;