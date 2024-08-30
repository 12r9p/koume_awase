'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 句のデータを定義
const originalKartaData = [
  { upper: "春の日の", lower: "光を浴びて" },
  { upper: "真夏の夜の", lower: "淫夢" },
  { upper: "秋の風", lower: "色づく木々" },
  { upper: "冬の朝", lower: "白い息吐く" },
  { upper: "雨上がり", lower: "虹かかる空" },
  // 以下に30個のデータを追加
  { upper: "朝の光", lower: "穏やかな空" },
  { upper: "夜の星空", lower: "静かな夜" },
  { upper: "春の花", lower: "咲き誇る" },
  { upper: "夏の海", lower: "青い波" },
  { upper: "秋の月", lower: "黄金の光" },
  { upper: "冬の雪", lower: "白い世界" },
  { upper: "風の音", lower: "優しいささやき" },
  { upper: "雨の音", lower: "リズムよく" },
  { upper: "夜の風", lower: "涼しい風" },
  { upper: "朝の霧", lower: "幻想的な景色" },
  { upper: "昼の光", lower: "明るい陽射し" },
  { upper: "夕方の空", lower: "橙色に染まる" },
  { upper: "春の風", lower: "心地よい" },
  { upper: "夏の花火", lower: "夜空に咲く" },
  { upper: "秋の葉", lower: "舞い落ちる" },
  { upper: "冬の朝日", lower: "希望の光" },
  { upper: "霧の中", lower: "幻想的な風景" },
  { upper: "海の音", lower: "心を落ち着ける" },
  { upper: "山の空気", lower: "清々しい" },
  { upper: "川の流れ", lower: "穏やかに" },
  { upper: "街の灯り", lower: "夜を彩る" },
  { upper: "公園の緑", lower: "リラックスする" },
  { upper: "街角の花", lower: "ほのかな香り" },
  { upper: "夜の街", lower: "賑やかな音" },
  { upper: "星の光", lower: "静かに輝く" },
  { upper: "月の光", lower: "柔らかく照らす" },
  { upper: "空の青さ", lower: "爽やかな色" },
  { upper: "日の出", lower: "新しい始まり" },
  { upper: "日の入り", lower: "一日の終わり" },
  { upper: "雪の音", lower: "静けさの中で" },
  { upper: "風の匂い", lower: "自然の息吹" },
  { upper: "川のせせらぎ", lower: "癒しの音" },
  { upper: "湖の面", lower: "鏡のように" }
];

const TOTAL_TIME = 17; // 各問題の制限時間（秒）
const NUM_QUESTIONS = 5; // 選ばれる問題の数

const Game: React.FC = () => {
  const router = useRouter(); // ルーターを取得
  const [kartaData, setKartaData] = useState(originalKartaData); // ランダム化された句のデータ
  const [currentQuestion, setCurrentQuestion] = useState(0); // 現在の問題番号
  const [score, setScore] = useState(0); // プレイヤーのスコア
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // 残り時間
  const [gameOver, setGameOver] = useState(false); // ゲームオーバー状態
  const [choices, setChoices] = useState<string[]>([]); // 選択肢の配列
  const [fade, setFade] = useState(true); // フェード効果の状態

  // 回答履歴を保存するための状態
  const [history, setHistory] = useState<{ question: string, answer: string, correct: boolean, timeSpent: number, correctAnswer?: string }[]>([]);
  const [startTime, setStartTime] = useState(Date.now()); // 問題開始時刻

  // 音声ファイルの参照
  const audioRef = useRef<HTMLAudioElement>(null);

  // コンポーネントのマウント時にデータをシャッフル
  useEffect(() => {
    // データをシャッフルして5つの問題を選択
    const shuffleArray = (array: any[]) => array.sort(() => 0.5 - Math.random());
    const selectedData = shuffleArray([...originalKartaData]).slice(0, NUM_QUESTIONS);
    setKartaData(selectedData); // シャッフルされたデータを設定
  }, []);

  useEffect(() => {
    // 問題が終了した場合の処理
    if (currentQuestion >= kartaData.length) {
      setGameOver(true);
      return;
    }

    // 音声再生
    if (audioRef.current) {
      audioRef.current.play();
    }

    // 選択肢を生成
    generateChoices();
    setStartTime(Date.now()); // 問題開始時刻を設定

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
    const isCorrect = choice === kartaData[currentQuestion].lower; // 正誤判定
    const timeSpent = TOTAL_TIME - timeLeft; // 回答にかかった時間
    const correctAnswer = kartaData[currentQuestion].lower; // 正解の答え
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3); // 時間ボーナスを計算
      setScore(score + 10 + timeBonus); // スコアを更新
    }
    
    // 音声停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // 再生位置をリセット
    }
    
    // 回答履歴を更新
    setHistory([
      ...history,
      {
        question: kartaData[currentQuestion].upper,
        answer: choice,
        correct: isCorrect,
        timeSpent: timeSpent,
        correctAnswer: isCorrect ? undefined : correctAnswer // 不正解の場合に正解を記録
      }
    ]);

    nextQuestion(); // 次の問題に移行
  };

  // タイマーのバーを表示するコンポーネント
  const TimerBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-[17s] ease-linear" 
        style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%`, transitionTimingFunction: 'linear', transitionDuration: `${timeLeft}s` }}
      ></div>
    </div>
  );

  // ゲームオーバーの場合の表示
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center p-6 bg-white text-black rounded-lg shadow-2xl transform scale-105 transition-transform duration-300">
          <h1 className="text-5xl font-bold mb-4 animate-pulse">ゲーム終了！</h1>
          <p className="text-4xl font-extrabold mb-4 animate-bounce">あなたのスコア</p>
          <p className="text-6xl font-bold mb-4 text-yellow-400 animate-fadeIn">{score}</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">回答履歴</h2>
          <div className="max-w-xl mx-auto">
            {history.map((item, index) => (
              <div key={index} className="p-4 mb-2 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="text-sm font-semibold mb-1">問題: {item.question}</p>
                <p className="text-sm mb-1">あなたの回答: <span className={`font-bold ${item.correct ? 'text-green-600' : 'text-red-600'}`}>{item.answer}</span></p>
                <p className="text-sm mb-1">正誤判定: {item.correct ? '正解' : '不正解'}</p>
                {item.correctAnswer && !item.correct && (
                  <p className="text-sm mb-1 text-red-600">正解: {item.correctAnswer}</p>
                )}
                <p className="text-sm">回答までの秒数: {item.timeSpent}秒</p>
              </div>
            ))}
          </div>

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
      <audio ref={audioRef} src="/game/Koume.wav" preload="auto"></audio> {/* 音声ファイルの設定 */}
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
