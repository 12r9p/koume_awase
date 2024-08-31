'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Axiosを使ってAPIリクエストを送信

// 句のデータを定義
const originalKoumeData = [{ upper: "英語を復習していたら", lower: "スイカがへし折ってました～。" }, { upper: "量子もつれに巻き込まれたと思ったら", lower: "かつてないほど横浜でした～。" }, { upper: "台風ですら進路が決まっているというのに！。かと思ったら", lower: "糸こんにゃく食べまくり社長でした～。" }, { upper: "人生やり直し機を買ったと思ったら", lower: "ちえっちえっこりちえっこりっさりっさっさっまんまんまさっさっまんまちえっちえっ でした～。" }, { upper: "泳がせ釣りに誘われたので行ってみたら", lower: "私は空の役でした～。" }, { upper: "慢心が1番の敵かと思っていたら", lower: "輪揚げ火事の元カンカンでした～。" }, { upper: "ドレスコ～ド無いクル～ズ旅ないかなあかと思ったら", lower: "払わないトンカツ叫ぶでした～。" }, { upper: "体調崩さないと健康の大切さに気付けないかと思ったら", lower: "まだ地球に居ないワンダフォ～の時でした～。" }, { upper: "ミニスカポリスがかがんだので見えちゃうかと思ったら", lower: "ミニスカポリスじろうでした～。" }, { upper: "リュウグウノツカイかと思ったら", lower: "あなたはリップクリ～ムでした～。" }, { upper: "グルメテーブルかけでかつ丼出したら", lower: "桃子ちょうちん脳みそに入れるでした～。" }, { upper: "ミドリムシに", lower: "麺に練りこまれました～。" }, { upper: "台風が来ないなあと思っていたら", lower: "いま私は火星でした～。" }, { upper: "明日は台風来るよ気をつけようね！。かと思っていたら", lower: "よく見たらオ～トミ～ルでした～。" }, { upper: "失敗は成功のもとかと思ったら", lower: "成功は失敗のもとに目覚めました～。" }, { upper: "東京ガーデンシアター埋めたと思ったら", lower: "次は幕張メッセ2Daysでした～。" }, { upper: "お安い御用かと思ったら", lower: "白だし・白だし・白だしでした～。" }, { upper: "パリオリンピックついに閉幕！。かと思っていたら", lower: "婚約指輪がワイファイ飛んでいてでした～。" }, { upper: "新しく来た蜘蛛は何処かに行ってしまい", lower: "前からいる蜘蛛が残りました" }, { upper: "アンキパンを食べてみたら", lower: "和洋折衷運ババ積極されました～。" }, { upper: "ソロキャンプを楽しんでいるかと思ったら", lower: "背後霊が10人憑いてました～。" }, { upper: "ラングドシャを焼いたと思ったら", lower: "ワンル～ム見ながら連絡しましたんだけど??まあそれはでした～。" }, { upper: "パリオリンピツクまだまだ熱狂！かと思ったら", lower: "１秒間にチクショウ５回言う練習するネズミチクチュウでした～。" }, { upper: "実は私も塗リキュアでした！。かと思ったら", lower: "私がスマホにトイレ落とされてました～。" }, { upper: "歴史に残る大暴落かと思っていたら", lower: "ラヴレタ～に水中メガネのタヌキを書いてました～。" }, { upper: "抽選ル～レットくるくるかと思っていたら", lower: "めんつゆでした～よく見たら。" }, { upper: "何やってもうまくいく人生の近くに引っ越ししたら", lower: "何やってもうまくいく人生が潰れました～。" }, { upper: "無課金チクショウおじさんかと思ったら", lower: "集めたヴェルマ～クを勝手に捨てられてました～。" }, { upper: "胸に手を当てて考えてみたら", lower: "春巻の演技でした～。" }, { upper: "立ち食いそば屋だけどイスあるしウドンあるお店あるよなあかと思ったら", lower: "合コンが終わってました～。" }, { upper: "表札がかまぼこの板かと思ったら", lower: "分からないんですがオクラが納豆と～緒にしないでと願ってました～。" }, { upper: "｛変わらないわね～！。｝同窓会で言われると思ったら", lower: "アツアツのミックスピッツアでした～。" }, { upper: "女性はメイクで見た目が凄く変わるかと思ったら", lower: "鳥人間コンテストでした～。" }, { upper: "ワンタイムパスワ～ドをニャンタイムパスワ～ドにする発明をしていたら", lower: "ヌ～リ～でした～。" }, { upper: "いい人かと思ったら", lower: "悪い人でした～。" }, { upper: "東京はチクショウ気温５００℃！。かと思ったら", lower: "消費期限切れ玄関ちょっと食べちゃったでした～。" }, { upper: "新紙幣をもらいにったら", lower: "ダイヤル金庫が私でした～。" }, { upper: "ヲ級の近くに引っ越ししたら", lower: "ヲ級が潰れました～。" }, { upper: "耳をすませばを見ていると思ったら", lower: "今日の料理 ミミガ～入りすまし汁を見てました～。" }, { upper: "フル～ツ牛乳を飲んだと思ったら", lower: "タニシが殻から出てきてお手玉でした～。" }, { upper: "レタスに", lower: "キャベツにされました～。" }, { upper: "もう！。油断も隙もあったもんじゃない！かと思ったら", lower: "霜降りチュ～ブを舐めまわすように見て牛肉でピンタされれました～。" }, { upper: "フラッシュ暗算かと思ったら", lower: "カブトムシでイノシシ摂取でした～。" }, { upper: "キャベツに", lower: "レタスにされました～。" }, { upper: "値段上がってもいいから中身減らさないでほしいかと思ったら", lower: "腹踊りで対抗でした～。" }, { upper: "どこでもドアを開けてみたら", lower: "わかったら今日は和食よ！でした～。" }, { upper: "東京湾に沈められていたら", lower: "玉ねぎを収穫してました～。" }, { upper: "洗面所の製麺所が狭ぇ～んじょ！。かと思ったら", lower: "軟体おじさんでした～。" }, { upper: "ＦＰに相談したかと思ったら", lower: "ファンタスティックパンナコッタでした～。" }, { upper: "おのずと答えは見えてくるかと思ったら", lower: "みそ汁に私の手が入ってました～。" }, { upper: "初めて収録で大笑いとれたなあと思っていたら", lower: "ＯＡみたら首折れて失格でした～。" }, { upper: "タイム風呂敷を使ってみたら", lower: "アニメは年取らないでした～。" }, { upper: "カルガモの親子かと思ったら", lower: "あめとむちあめとむちなんだよボァアボァアムチムチチョゲチョゲできまタレタレした～のした～の。" }, { upper: "フロッピ～デイスクを買ったと思ったら", lower: "覚悟が足りてませんでした～。" }, { upper: "道かと思ったら", lower: "骨でした～。" }, { upper: "屋久杉で屋久島を見てると思ったら", lower: "高輪ゲ～トウエイ駅でした～。" }, { upper: "セクシ～お姉さんが壺を１０万円で売ってくれるというので１０万回ロ～ン組んだら", lower: "汽車ポッポ～！会見でした～。" }, { upper: "四次元ポケットに手を入れてみたら", lower: "永遠 foreverrunでした～。" }, { upper: "今日ふとおもったのですが", lower: "本場自宅でカップ焼きそばのゆで汁飲んでました～。" }, { upper: "地球はガチャガチャカプセルみたいに閉じ込められているわけではないのかチクシヨ！。かと思ったら", lower: "ヴァルサン焚いたらいなくなりました～。" }, { upper: "カップラメ～ンにかやくを入れたら", lower: "５年差でした～。" }, { upper: "｛ピザ｝と１０回言ったと思ったら", lower: "タッパア叩きにあってました～。" }, { upper: "零れ落ちた私の涙で姫が目覚めたと思ったら", lower: "私が手を挙げてました～。" }, { upper: "ゴリラゲイ雨かと思ったら", lower: "川の上で明太子フリフリダンスでした～。" }, { upper: "汁なしス～プパスタ専門店の近くに引っ越ししたら", lower: "汁なしス～プパスタ専門店が潰れました～。" }, { upper: "沈没船を探索していたら", lower: "うまい棒で８％良いやでした～。" }, { upper: "ゴキブリ撃退スプレ～を噴射したと思ったら～、 生クリ～ムスプレ～でした～。かと思ったら～、 強風で白塗り取れたら", lower: "毛布が4k ? ~。" }, { upper: "企業理念を大声で叫んだら", lower: "毒蛇遠回りでした～。" }, { upper: "ストロベリ～バニラアイスを食べたと思ったら", lower: "カクヤスでした～。" }, { upper: "人がゴミのようかと思ったら", lower: "頭だけ宇宙に入ってました～。" }, { upper: "からし入りシュ～クリ～ムかと思ったら", lower: "F ? あのときトキメキ切手２枚でした～。" }, { upper: "最終的にみんなが損するかと思ったら", lower: "F ? 油揚げ買って - $Jのって２した～。" }, { upper: "ブ～メランパンツを凍らせて投げてみたら", lower: "新５００円ダマ使うぞ意を決してでした～。" }, { upper: "レタスかと思ったら", lower: "メインディッシュ前に食べてみたらあの時助けてもらった鶴でした～。" }, { upper: "口を動かさないで手を動かせ！かと思ったら", lower: "神だけにシ～ンでした～。" }, { upper: "もやしを買ったと思ったら", lower: "熱海の別荘でした～。" }, { upper: "｛私たち、風になってる！。｝かと思ったら", lower: "山芋の攻撃力は！３！でした～。" }, { upper: "カメムシが大量発生しているかと思ったら", lower: "私にとっては意味ありでした～。" }, { upper: "エレベ～タ～に乗ってボタンを押したら", lower: "豚骨ラ～メンのボタンでした～。" }, { upper: "社外秘かと思ったら", lower: "空気わたあめフアフアでした～。" }, { upper: "地球はかつて平面だと考えられていたかと思ったら", lower: "イカ焼きかたこ焼きで悩んでました～。" }, { upper: "今週も１週間がんばりまチクショウ！。かと思ったら", lower: "人工衛星を脇で挟んでました～。" }, { upper: "都内にオ～ロラが現れたかと思ったら", lower: "おいしいなあアイスの後のプ～ルはモナカのでした～。" }, { upper: "太陽フレアンパンを求める大行列かと思ったら", lower: "月桂樹ロ～リエ抱き合わせでした～。" }, { upper: "白塗り同意アプリで同意させるアプリを同意させるアプリを同意させるアプリを同意させるアプリを同意させるアプリを同意させるアプリを使ってみ たら", lower: "訴えられました～。" }, { upper: "潮干狩りのために熊手を買ったと思ったら", lower: "私の頭を投げられてました～。" }, { upper: "まいにち朝までドラえもん映画を見ていたら", lower: "1000年たっていて生まれ変わってずっと引きこもり体重100kgなっていたよ~" }, { upper: "湘南デストラ～デ再結成！。かと思ったら", lower: "骨付き肉が食べたくなりました～。" }, { upper: "ア～もう最終日かあかと思っていたら", lower: "直売所で間に入られ訓読みでした～。" }
];

const TOTAL_TIME = 18; // 各問題の制限時間（秒）
const NUM_QUESTIONS = 5; // 選ばれる問題の数
const NUM_CHOICES = 2; // 各問題の選択肢の数
const highSchools = [
  '茨城高専',
  '群馬高専',
  '木更津高専',
  '小山高専',
  '東京高専',
  '産技高専',
  '長岡高専',
  '教員',
  '一般参加',
  'その他'
];

const Game: React.FC = () => {
  const router = useRouter();
  // 状態の定義
  const [KoumeData, setKoumeData] = useState(originalKoumeData); // ランダム化された句のデータ
  const [currentQuestion, setCurrentQuestion] = useState(0); // 現在の問題番号
  const [score, setScore] = useState(0); // プレイヤーのスコア
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // 残り時間
  const [gameOver, setGameOver] = useState(false); // ゲームオーバー状態
  const [choices, setChoices] = useState<string[]>([]); // 選択肢の配列
  const [fade, setFade] = useState(true); // フェード効果の状態
  const [history, setHistory] = useState<{ question: string, answer: string, correct: boolean, timeSpent: number, correctAnswer?: string }[]>([]); // 回答履歴
  const [startTime, setStartTime] = useState(Date.now()); // 問題開始時刻
  const [isTransitioning, setIsTransitioning] = useState(false); // トランジション状態（多重クリック防止用）
  const [playerName, setPlayerName] = useState(""); // プレイヤー名の状態
  const [isSubmitting, setIsSubmitting] = useState(false); // 提出中フラグ
  const [selectedSchool, setSelectedSchool] = useState(""); // 高専名の状態

  const audioRef = useRef<HTMLAudioElement>(null); // 音声ファイルの参照

  // コンポーネントのマウント時にデータをシャッフル
  useEffect(() => {
    // データをシャッフルして指定数の問題を選択
    const shuffleArray = (array: any[]) => array.sort(() => 0.5 - Math.random());
    const selectedData = shuffleArray([...originalKoumeData]).slice(0, NUM_QUESTIONS);
    setKoumeData(selectedData);
  }, []);

  // 問題が変わるたびに実行される効果
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
        return prevTime - 0.01; // 残り時間を0.01秒減少
      });
    }, 10);

    // クリーンアップ関数
    return () => clearInterval(timer);
  }, [currentQuestion, KoumeData]);

  // 選択肢を生成する関数
  const generateChoices = () => {
    const correctAnswer = KoumeData[currentQuestion].lower; // 正解の答え
    const allAnswers = originalKoumeData.map(item => item.lower); // 全ての答え

    // 正解を除いた他の答えをシャッフル
    const otherAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const shuffled = [...otherAnswers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, NUM_CHOICES - 1);

    const allChoices = [...selected, correctAnswer].sort(() => 0.5 - Math.random()); // 正解を含めてシャッフル

    setChoices(allChoices); // 選択肢を設定
  };

  // 次の問題に進む関数
  const nextQuestion = () => {
    setFade(false); // フェードアウト開始
    setIsTransitioning(true); // トランジション開始
    setTimeout(() => {
      if (currentQuestion < KoumeData.length - 1) {
        setCurrentQuestion(currentQuestion + 1); // 次の問題に進む
        setTimeLeft(TOTAL_TIME); // 時間をリセット
      } else {
        setGameOver(true); // ゲーム終了
      }
      setFade(true); // フェードイン開始
      setIsTransitioning(false); // トランジション終了
    }, 300); // フェードアウトアニメーションの持続時間に合わせて300ms設定
  };

  // 回答処理関数
  const handleAnswer = (choice: string) => {
    if (isTransitioning) return; // トランジション中はクリックを無視

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

  // 時間切れ処理
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer(""); // 時間切れの場合、空の回答として処理
    }
  }, [timeLeft]);

  // タイマーのバーを表示するコンポーネント
  const TimerBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-[17s] ease-linear"
        style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%`, transitionTimingFunction: 'linear', transitionDuration: `${timeLeft}s` }}
      ></div>
    </div>
  );

  // スコアをNotionに保存する関数
  const saveScore = async () => {
    if (!playerName || !selectedSchool) return;

    setIsSubmitting(true);

    try {
      await axios.post('/api/saveScore', { name: playerName, school: selectedSchool, score });
      alert('スコアが保存されました！');
    } catch (error) {
      console.error('スコアの保存に失敗しました', error);
      alert('スコアの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
    router.push('/')
  };


  // ゲームオーバーの場合の表示
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center p-6 bg-white text-black rounded-lg shadow-2xl transform scale-105 transition-transform duration-300 my-8">
          <h1 className="text-5xl font-bold mb-4 animate-pulse p-10">ゲーム終了！</h1>
          <p className="text-4xl font-extrabold mb-4 animate-bounce">あなたのスコア</p>
          <p className="text-6xl font-bold mb-4 text-yellow-400 animate-fadeIn">{score}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">回答履歴</h2>
          <div className="max-w-xl mx-auto">
            {KoumeData.map((item, index) => {
              // 回答履歴がない場合は未回答として扱う
              const historyItem = history[index] || { answer: "未回答", correct: false, timeSpent: TOTAL_TIME };
              return (
                <div key={index} className="p-4 mb-3 bg-gray-100 border border-gray-300 rounded-lg">
                  <p className="text-sm font-semibold mb-1">問題: {item.upper}</p>
                  <p className="text-sm mb-1">あなたの回答: <span className={`font-bold ${historyItem.correct ? 'text-green-600' : 'text-red-600'}`}>{historyItem.answer}</span></p>
                  <p className="text-sm mb-1">正誤判定: {historyItem.correct ? '正解' : '不正解'}</p>
                  {!historyItem.correct && (
                    <p className="text-sm mb-1 text-red-600">正解: {item.lower}</p>
                  )}
                  <p className="text-sm">回答までの秒数: {Math.floor(historyItem.timeSpent)}秒</p>
                </div>
              );
            })}
          </div>
          <div className="my-8">
            <input
              type="text"
              placeholder="プレイヤー名"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mr-2"
            />
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mr-2"
            >
              <option value="" disabled>高専名を選択</option>
              {highSchools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <button
              onClick={saveScore}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full mt-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              スコアを保存する
            </button>
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
            <p className="text-4xl font-bold text-indigo-600 my-4">スコア: {score}</p>
            <p className="text-lg text-black">残り時間: {Math.floor(timeLeft)}秒</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">{KoumeData[currentQuestion].upper}</h2>
            <div className="grid grid-cols-2 gap-6">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => !isTransitioning && handleAnswer(choice)}
                  className={`bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105 ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isTransitioning}
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
