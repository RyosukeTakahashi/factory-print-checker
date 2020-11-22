import Head from "next/head";
import Squares from "../components/Squares";
import {
  AppLayoutGrid,
  classes,
  classHash,
  Pane,
  StyledFlexRadioGroup,
} from "../src/constants";
import LeftPane from "../components/LeftPane";
import { Button } from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  areaPickedTimeAtom,
  chosenClassAtom,
  classPickedTimeAtom,
  clickedAreasAtom,
  isInAnswerRevealSectionAtom,
  isInClassifySectionAtom,
  isInGridSectionAtom,
  labelImgUrlAtom,
  maxSessionCountAtom,
  nthQuestionInSessionAtom,
  nthSessionAtom,
  questionModeAtom,
  sessionStartedTimeAtom,
  showAnswerAtom,
  startedAtom,
  startedTimeAtom,
  subjectIdAtom,
  targetImgUrlAtom,
} from "../src/atoms";
import { saveAnswerData } from "../src/fetchers";
import { GetStaticProps } from "next";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as React from "react";
import { useState } from "react";
import firebase from "../firebase/clientApp";
import AnnotatedImage from "../components/AnnotatedImage";

//todo: 1セッション目で画像が表示されるようにする。
//todo: LFの画像選定ロジック作成
//todo: LFのセッション終了条件作成
//todo: 出題済みクラスを選ばないようにする（選択されたstate＆選択済みstate作成）

export default function Home({}: {}) {
  const [started, setStarted] = useRecoilState(startedAtom);
  const setClickedAreas = useRecoilValue(clickedAreasAtom);
  const [nthSession, setNthSession] = useRecoilState(nthSessionAtom);
  const [nthQuestionInSession, setNthQuestionInSession] = useRecoilState(
    nthQuestionInSessionAtom
  );
  const maxSessionCount = useRecoilValue(maxSessionCountAtom);
  const [targetImgUrl, setTargetImgUrl] = useRecoilState(targetImgUrlAtom);
  const setLabelImgUrl = useSetRecoilState(labelImgUrlAtom);
  const [sessionStartedTime, setSessionStartedTime] = useRecoilState(
    sessionStartedTimeAtom
  );
  const [areaPickedTime, setAreaPickedTime] = useRecoilState(
    areaPickedTimeAtom
  );
  const [classPickedTime, setClassPickedTime] = useRecoilState(
    classPickedTimeAtom
  );
  const [isInAnswerRevealSection, setIsInAnswerRevealSection] = useRecoilState(
    isInAnswerRevealSectionAtom
  );
  const [isInClassifySection, setIsInClassifySection] = useRecoilState(
    isInClassifySectionAtom
  );
  const [isInGridSection, setIsInGridSection] = useRecoilState(
    isInGridSectionAtom
  );
  const [correctClass, setCorrectClass] = useState("");
  const [chosenClass, setChosenClass] = useRecoilState(chosenClassAtom);
  const subjectId = useRecoilValue(subjectIdAtom);
  const selectedMode = useRecoilValue(questionModeAtom);
  const showAnswer = useRecoilValue(showAnswerAtom);
  const startedTime = useRecoilValue(startedTimeAtom);
  const clickedAreas = useRecoilValue(clickedAreasAtom);

  const chooseNextClass = () => {
    //(SR/LF)のロジックに基づき、画像を選定する
    let correctClass = "";
    switch (selectedMode) {
      case "LF":
        correctClass = classes[Math.floor(Math.random() * classes.length)];
        break;
      case "SR":
        correctClass = classes[Math.floor(Math.random() * classes.length)];
        break;
    }
    setCorrectClass(correctClass);
    return correctClass;
  };

  const getNextImagePath = async () => {
    const storage = firebase.storage();
    const targetPath = `printer_test/target/${chooseNextClass()}/${selectedMode}`;
    const listResultDateFolder = await storage
      .ref()
      .child(targetPath)
      .listAll();
    const prefixes = listResultDateFolder.prefixes;
    const folderRef = prefixes[Math.floor(Math.random() * prefixes.length)];
    const listResultImgs = await folderRef.listAll();
    const imgRefs = listResultImgs.items;
    const imgRef = imgRefs[Math.floor(Math.random() * imgRefs.length)];
    const targetImgUrl = await imgRef.getDownloadURL();
    const labelImgUrl = await storage
      .ref(imgRef.location.path_.replace("target", "label"))
      .getDownloadURL();
    setTargetImgUrl(targetImgUrl);
    setLabelImgUrl(labelImgUrl);
  };
  const moveToAreaPickSection = () => {
    setSessionStartedTime(Date.now());
    setIsInAnswerRevealSection(false);
    setIsInGridSection(true);
  };
  const moveToClassPickSection = () => {
    setAreaPickedTime(Date.now());
    setIsInGridSection(false);
    setIsInClassifySection(true);
  };
  const moveToShowAnswerSection = () => {
    setClassPickedTime(Date.now());
    setIsInClassifySection(false);
    setIsInAnswerRevealSection(true);
  };

  const moveToNextSession = () => {
    const answer = {
      subjectId,
      selectedMode,
      showAnswer,
      nthSession,
      nthQuestionInSession,
      targetImgUrl,
      clickedAreas,
      chosenClass,
      correctClass,
      chosenClassCorrect: chosenClass === correctClass,
      startedTime,
      sessionStartedTime,
      areaPickedTime,
      classPickedTime,
    };
    saveAnswerData(answer).then((r) => {});
    setNthSession(nthSession + 1);
    setNthQuestionInSession(nthQuestionInSession + 1);
    getNextImagePath().then((r) => {});
    moveToAreaPickSection();
    if (maxSessionCount <= nthSession) endSessionSet();
  };

  const endSessionSet = () => {
    //SRだと、全セッション7門出題（各クラス1回ずつ）) done
    //LFだと、1セッション目は7門だけど、それ以降のセッションは各クラスの累積正答率（後述参照）をみて、出題するクラスを絞っていく＆並べ替える
    setStarted(false);
  };

  const nextButton = (() => {
    if (isInGridSection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          disabled={setClickedAreas.length == 0}
          onClick={() => moveToClassPickSection()}
        >
          グリッドをを選択したときに推すボタン
        </Button>
      );
    if (isInClassifySection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => moveToShowAnswerSection()}
        >
          分類を選択にしたときに押すボタン
        </Button>
      );
    if (isInAnswerRevealSection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => moveToNextSession()}
        >
          次の問題に行くときのボタン
        </Button>
      );
  })();

  const answerMessage =
    chosenClass === correctClass
      ? "正解です。"
      : `不正解です。正解は${correctClass}です。`;

  const classOptions = Object.keys(classHash).map((key) => (
    <FormControlLabel
      value={key}
      control={<Radio />}
      label={classHash[key]}
      key={key}
      disabled={isInAnswerRevealSection}
    />
  ));

  return (
    <>
      <Head>
        <title>{"印刷チェッカー"}</title>
      </Head>
      <AppLayoutGrid>
        <LeftPane />
        {started && (
          <Pane area={"centerPane"}>
            <p>{`第${nthSession}セッション, 第${nthQuestionInSession}問目`}</p>
            <main className={"flex justify-around"}>
              <Squares />
              {isInAnswerRevealSection && <AnnotatedImage />}
            </main>

            {(isInClassifySection || isInAnswerRevealSection) && (
              <StyledFlexRadioGroup
                row
                name="class-selection"
                value={chosenClass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChosenClass(e.target.value)
                }
              >
                {classOptions}
              </StyledFlexRadioGroup>
            )}

            {isInAnswerRevealSection && <div>{answerMessage}</div>}

            {nextButton}
          </Pane>
        )}
      </AppLayoutGrid>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
