'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 句のデータを定義
const originalKartaData = [
  { upper: "春の日の", lower: "光を浴びて" },
  { upper: "夏の夜の", lower: "星空仰ぐ" },
  { upper: "秋の風", lower: "色づく木々" },
  { upper: "冬の朝", lower: "白い息吐く" },
  { upper: "雨上がり", lower: "虹かかる空" },
  // 他の句を追加...
];

const TOTAL_TIME = 15; // 各問題の制限時間（秒）

const Game: React.FC = () => {
  const router = useRouter(); // ルーターを取得
  const [kartaData, setKartaData] = useState(originalKartaData); // ランダム化された句のデータ
  const [currentQuestion, setCurrentQuestion] = useState(0); // 現在の問題番号
  const [score, setScore] = useState(0); // プレイヤーのスコア
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // 残り時間
  const [gameOver, setGameOver] = useState(false); // ゲームオーバー状態
  const [choices, setChoices] = useState<string[]>([]); // 選択肢の配列
  const [fade, setFade] = useState(true); // フェード効果の状態

  // コンポーネントのマウント時にデータをシャッフル
  useEffect(() => {
    // 句データをシャッフル
    const shuffleArray = (array: any[]) => array.sort(() => 0.5 - Math.random());
    setKartaData(shuffleArray([...originalKartaData])); // シャッフルされたデータを設定
  }, []);

  useEffect(() => {
    // 問題が終了した場合の処理
    if (currentQuestion >= kartaData.length) {
      setGameOver(true);
      return;
    }

    // 選択肢を生成
    generateChoices();

    // タイマーを設定
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // タイマーをクリア
          nextQuestion(); // 次の問題に移行
          return TOTAL_TIME; // 時間をリセット
        }
        return prevTime - 1; // 残り時間を1秒減少
      });
    }, 1000);

    // クリーンアップ関数
    return () => clearInterval(timer);
  }, [currentQuestion, kartaData]); // currentQuestionまたはkartaDataが変更されたときに実行

  const generateChoices = () => {
    const correctAnswer = kartaData[currentQuestion].lower; // 正解の答え
    const otherAnswers = kartaData
      .filter((_, index) => index !== currentQuestion) // 他の答えをフィルタリング
      .map(item => item.lower);
    
    const shuffled = [...otherAnswers].sort(() => 0.5 - Math.random()); // 他の答えをシャッフル
    const selected = shuffled.slice(0, 3); // 3つの答えを選択
    const allChoices = [...selected, correctAnswer].sort(() => 0.5 - Math.random()); // 正解を含めてシャッフル
    
    setChoices(allChoices); // 選択肢を設定
  };

  const nextQuestion = () => {
    setFade(false); // フェードアウト開始
    setTimeout(() => {
      if (currentQuestion < kartaData.length - 1) {
        setCurrentQuestion(currentQuestion + 1); // 次の問題に進む
        setTimeLeft(TOTAL_TIME); // 時間をリセット
      } else {
        setGameOver(true); // ゲーム終了
      }
      setFade(true); // フェードイン開始
    }, 500); // フェードアウトアニメーションの持続時間に合わせて500ms設定
  };

  const handleAnswer = (choice: string) => {
    // 答えが正しいかどうかを確認
    if (choice === kartaData[currentQuestion].lower) {
      const timeBonus = Math.floor(timeLeft / 3); // 時間ボーナスを計算
      setScore(score + 10 + timeBonus); // スコアを更新
    }
    nextQuestion(); // 次の問題に移行
  };

  // タイマーのバーを表示するコンポーネント
  const TimerBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-[15s] ease-linear" 
        style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%`, transitionTimingFunction: 'linear', transitionDuration: `${timeLeft}s` }}
      ></div>
    </div>
  );

  // ゲームオーバーの場合の表示
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center p-6 bg-black text-white rounded-lg shadow-2xl transform scale-105 transition-transform duration-300">
          <h1 className="text-5xl font-bold mb-4 animate-pulse">ゲーム終了！</h1>
          <p className="text-4xl font-extrabold mb-4 animate-bounce">あなたのスコア</p>
          <p className="text-6xl font-bold mb-4 text-yellow-400 animate-fadeIn">{score}</p>
          <button
            onClick={() => router.push('/')} // ホームに戻るボタン
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full mt-4 transition duration-300 ease-in-out transform hover:scale-105"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  // ゲームプレイ中の表示
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
      <div className={`w-full max-w-2xl transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <TimerBar />
        <div className="mb-8 text-center">
          <p className="text-xl font-bold text-black">問題 {currentQuestion + 1} / {kartaData.length}</p>
          <p className="text-lg text-black">スコア: {score}</p>
          <p className="text-lg text-black">残り時間: {timeLeft}秒</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">{kartaData[currentQuestion].upper}</h2>
          <div className="grid grid-cols-2 gap-4">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(choice)} // 答えを選択するボタン
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
