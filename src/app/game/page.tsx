'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 句のデータを定義
const originalKoumeData = [
  { upper: "英語を復習していたら", lower: "スイカがへし折ってました～。" }, { upper: "量子もつれに巻き込まれたと思ったら", lower: "かつてないほど横浜でした～。" }, { upper: "台風ですら進路が決まっているというのに！。かと思ったら", lower: "糸こんにゃく食べまくり社長でした～。" }, { upper: "人生やり直し機を買ったと思ったら", lower: "ちえっちえっこりちえっこりっさりっさっさっまんまんまさっさっまんまちえっちえっ でした～。" }, { upper: "泳がせ釣りに誘われたので行ってみたら", lower: "私は空の役でした～。" }, { upper: "慢心が1番の敵かと思っていたら", lower: "輪揚げ火事の元カンカンでした～。" }, { upper: "ドレスコ～ド無いクル～ズ旅ないかなあかと思ったら", lower: "払わないトンカツ叫ぶでした～。" }, { upper: "体調崩さないと健康の大切さに気付けないかと思ったら", lower: "まだ地球に居ないワンダフォ～の時でした～。" }, { upper: "ミニスカポリスがかがんだので見えちゃうかと思ったら", lower: "ミニスカポリスじろうでした～。" }, { upper: "リュウグウノツカイかと思ったら", lower: "あなたはリップクリ～ムでした～。" }, { upper: "グルメテーブルかけでかつ丼出したら", lower: "桃子ちょうちん脳みそに入れるでした～。" }, { upper: "ミドリムシに", lower: "麺に練りこまれました～。" }, { upper: "台風が来ないなあと思っていたら", lower: "いま私は火星でした～。" }, { upper: "明日は台風来るよ気をつけようね！。かと思っていたら", lower: "よく見たらオ～トミ～ルでした～。" }, { upper: "失敗は成功のもとかと思ったら", lower: "成功は失敗のもとに目覚めました～。" }, { upper: "東京ガーデンシアター埋めたと思ったら", lower: "次は幕張メッセ2Daysでした～。" }, { upper: "お安い御用かと思ったら", lower: "白だし・白だし・白だしでした～。" }, { upper: "パリオリンピックついに閉幕！。かと思っていたら", lower: "婚約指輪がワイファイ飛んでいてでした～。" }, { upper: "新しく来た蜘蛛は何処かに行ってしまい", lower: "前からいる蜘蛛が残りました" }, { upper: "アンキパンを食べてみたら", lower: "和洋折衷運ババ積極されました～。" }, { upper: "ソロキャンプを楽しんでいるかと思ったら", lower: "背後霊が10人憑いてました～。" }, { upper: "ラングドシャを焼いたと思ったら", lower: "ワンル～ム見ながら連絡しましたんだけど??まあそれはでした～。" }, { upper: "パリオリンピツクまだまだ熱狂！かと思ったら", lower: "１秒間にチクショウ５回言う練習するネズミチクチュウでした～。" }, { upper: "実は私も塗リキュアでした！。かと思ったら", lower: "私がスマホにトイレ落とされてました～。" }, { upper: "歴史に残る大暴落かと思っていたら", lower: "ラヴレタ～に水中メガネのタヌキを書いてました～。" }, { upper: "抽選ル～レットくるくるかと思っていたら", lower: "めんつゆでした～よく見たら。" }, { upper: "何やってもうまくいく人生の近くに引っ越ししたら", lower: "何やってもうまくいく人生が潰れました～。" }, { upper: "無課金チクショウおじさんかと思ったら", lower: "集めたヴェルマ～クを勝手に捨てられてました～。" }, { upper: "胸に手を当てて考えてみたら", lower: "春巻の演技でした～。" }
];

const TOTAL_TIME = 17; // 各問題の制限時間（秒）
const NUM_QUESTIONS = 5; // 選ばれる問題の数
const NUM_CHOICES = 2; // 各問題の選択肢の数


const Game: React.FC = () => {
  const router = useRouter(); // ルーターを取得
  const [KoumeData, setKoumeData] = useState(originalKoumeData); // ランダム化された句のデータ
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
    const selectedData = shuffleArray([...originalKoumeData]).slice(0, NUM_QUESTIONS);
    setKoumeData(selectedData); // シャッフルされたデータを設定
  }, []);

  useEffect(() => {
    // 問題が終了した場合の処理
    if (currentQuestion >= KoumeData.length) {
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
        return prevTime - 0.01; // 残り時間を1秒減少
      });
    }, 10);

    // クリーンアップ関数
    return () => clearInterval(timer);
  }, [currentQuestion, KoumeData]); // currentQuestionまたはKoumeDataが変更されたときに実行

  const generateChoices = () => {
    const correctAnswer = KoumeData[currentQuestion].lower; // 正解の答え
    const allAnswers = originalKoumeData.map(item => item.lower); // 全ての答え

    // 正解を除いた他の答えをシャッフル
    const otherAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const shuffled = [...otherAnswers].sort(() => 0.5 - Math.random()); // シャッフル
    const selected = shuffled.slice(0, NUM_CHOICES - 1); // NUM_CHOICES - 1 の答えを選択

    const allChoices = [...selected, correctAnswer].sort(() => 0.5 - Math.random()); // 正解を含めてシャッフル

    setChoices(allChoices); // 選択肢を設定
  };

  const nextQuestion = () => {
    setFade(false); // フェードアウト開始
    setTimeout(() => {
      if (currentQuestion < KoumeData.length - 1) {
        setCurrentQuestion(currentQuestion + 1); // 次の問題に進む
        setTimeLeft(TOTAL_TIME); // 時間をリセット
      } else {
        setGameOver(true); // ゲーム終了
      }
      setFade(true); // フェードイン開始
    }, 300); // フェードアウトアニメーションの持続時間に合わせて300ms設定
  };

  const handleAnswer = (choice: string) => {
    const isCorrect = choice === KoumeData[currentQuestion].lower; // 正誤判定
    const timeSpent = TOTAL_TIME - timeLeft; // 回答にかかった時間
    const correctAnswer = KoumeData[currentQuestion].lower; // 正解の答え

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
        question: KoumeData[currentQuestion].upper,
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
                <p className="text-sm">回答までの秒数: {Math.floor(item.timeSpent)}秒</p>
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
      <audio ref={audioRef} src="/game/Koume.wav" preload="auto"></audio>

      <div className="w-full max-w-2xl">
        {/* 上部にホームに戻るボタンを追加 */}
        <div className="mb-4 text-center">
          <button
            onClick={() => router.push('/')} // ホームに戻るボタン
            className="absolute top-4 left-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            ホームに戻る
          </button>
        </div>

        <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <TimerBar />
          <div className="mb-8 text-center">
            <p className="text-xl font-bold text-black">問題 {currentQuestion + 1} / {KoumeData.length}</p>
            <p className="text-lg text-black">スコア: {score}</p>
            <p className="text-lg text-black">残り時間: {Math.floor(timeLeft)}秒</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">{KoumeData[currentQuestion].upper}</h2>
            <div className="grid grid-cols-2 gap-4">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
