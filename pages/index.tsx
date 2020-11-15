import Head from "next/head";
import RefOrInj from "../components/RefOrInj";
import Squares from "../components/Squares";
import { AppLayoutGrid, Pane } from "../src/constants";
import LeftPane from "../components/LeftPane";
import { Button } from "@material-ui/core";
import { useRecoilState, useRecoilValue } from "recoil";
import {clickedAreasAtom, startedAtom} from "../src/atoms";

// fetcher 記述
// getserversideprops でcsvを取得
// machine check result
// getchoice
// getrecoveryoptions
// getDownloadUrlsOfImgInFolder

//計測開始→最初のセッションセットの1セッション芽の開始

//**セッション
//(SR/LF)のロジックに基づき、画像を選定する
//画像を表示する
//欠点箇所のマスを選択されたら、OKボタンを活性化させる
//OKボタン押されたら、、、
// データ保存
//分類回答画面に行く。
//ラジボタンで分類を選択した後、OKボタンを押す
//データ保存
//分類正誤表示にいく
//不正解の場合、、正しい分類を表示
//元画像の隣にアノテーション画像を表示
//次のボタンを押す
//次のセッションに写る。または以下の条件次第でセッションセット終了する。
//SRだと、全セッション7門出題（各クラス1回ずつ）)
//LFだと、1セッション目は7門だけど、それ以降のセッションは各クラスの累積正答率（後述参照）をみて、出題するクラスを絞っていく＆並べ替える

const params = {
  subjectId: "",
  questionId: "", //画像名
  chosenClass: "",
  chosenGrid: [],
  usedTimeForClass: "",
  usedTimeForGrid: "",
  timePassedSinceStart: "",
  chosenClassCorrect: false,
};

export default function Home({}: {}) {
  const [started, setStarted] = useRecoilState(startedAtom);
  const setClickedAreas = useRecoilValue(clickedAreasAtom);

  const moveToNextSession = () => {};
  const getNextImagePath = () => {};
  const setBackgroundImage = () => {};
  const saveAnswerData = () => {}; //in fetcher.ts
  const moveToAreaPickSection = () => {};
  const moveToClassPickSection = () => {};
  const showClassAnswer = () => {
    return "setAnswerState";
  };
  const showAnnotatedImage = () => {
    return "setAnswerState";
  };
  const endSessionSet = () => {};

  return (
    <>
      <Head>
        <title>{"印刷チェッカー"}</title>
      </Head>
      <AppLayoutGrid>
        <LeftPane />
        <Pane area={"centerPane"}>
          <p>第1セッション 1問目</p>
          <main className={"flex justify-around"}>
            <Squares />
            <Squares />
          </main>

          <Button
            variant={"contained"}
            color={"primary"}
            disabled={setClickedAreas.length == 0}
          >
            グリッドをを選択したときに推すok
          </Button>
          <button>分類を選択したときに推すok</button>
          <button>次の問題に行くときのボタン</button>
        </Pane>
      </AppLayoutGrid>
    </>
  );
}
