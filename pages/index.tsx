import Head from "next/head";
import Squares from "../components/Squares";
import {
  AppLayoutGrid,
  classHash,
  Pane,
  StyledFlexRadioGroup,
} from "../src/constants";
import LeftPane from "../components/LeftPane";
import { Button } from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  areaPickedTimeAtom,
  userChosenClassAtom,
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
  sessionSetStartedTimeAtom,
  subjectIdAtom,
  targetImgUrlAtom,
  correctClassAtom,
} from "../src/atoms";
import { saveAnswerData } from "../src/fetchers";
import { GetStaticProps } from "next";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as React from "react";
import AnnotatedImage from "../components/AnnotatedImage";
import { chooseNextClass, getNextImagePath } from "../lib/utils";
import firebase from "firebase";

//todo: squares動かないようにする
//todo: 出題済みクラスを選ばないようにする（選択されたstate＆選択済みstate作成）
//todo: LFのクラス選定ロジック作成
//todo: LFのセッション終了ロジック作成

export default function Home({}: {}) {
  const [started, setStarted] = useRecoilState(startedAtom);
  const [clickedAreas, setClickedAreas] = useRecoilState(clickedAreasAtom);
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
  const [correctClass, setCorrectClass] = useRecoilState(correctClassAtom);
  const [userChosenClass, setUserChosenClass] = useRecoilState(
    userChosenClassAtom
  );
  const subjectId = useRecoilValue(subjectIdAtom);
  const selectedMode = useRecoilValue(questionModeAtom);
  const showAnswer = useRecoilValue(showAnswerAtom);
  const sessionSetStartedTime = useRecoilValue(sessionSetStartedTimeAtom);

  const moveToAreaPickSection = async () => {
    setIsInAnswerRevealSection(false);
    setIsInGridSection(true);
    //already selected class的stateを加える。
    const nextClass = chooseNextClass(selectedMode);
    setCorrectClass(nextClass);
    const targetPath = `printer_test/target/${nextClass}/${selectedMode}`;
    const imgUrls = await getNextImagePath(targetPath);
    setTargetImgUrl(imgUrls.target);
    setLabelImgUrl(imgUrls.label);
    setSessionStartedTime(firebase.firestore.Timestamp.now());
  };
  const moveToClassPickSection = () => {
    setIsInGridSection(false);
    setIsInClassifySection(true);
    setAreaPickedTime(firebase.firestore.Timestamp.now());
  };
  const moveToShowAnswerSection = () => {
    setIsInClassifySection(false);
    setIsInAnswerRevealSection(true);
    setClassPickedTime(firebase.firestore.Timestamp.now());
  };

  const moveToNextSession = async () => {
    const answer = {
      subjectId,
      selectedMode,
      showAnswer,
      nthSession,
      nthQuestionInSession,
      targetImgUrl,
      clickedAreas,
      userChosenClass,
      correctClass,
      chosenClassCorrect: userChosenClass === correctClass,
      startedTime: sessionSetStartedTime,
      sessionStartedTime,
      areaPickedTime,
      classPickedTime,
    };
    await saveAnswerData(answer);
    setNthSession(nthSession + 1);
    setNthQuestionInSession(nthQuestionInSession + 1);
    if (maxSessionCount <= nthSession) {
      endSessionSet();
      return;
    }
    setClickedAreas([]);
    setUserChosenClass(undefined);
    moveToAreaPickSection().then();
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
          disabled={clickedAreas.length == 0}
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
          disabled={userChosenClass === ""}
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
    userChosenClass === correctClass
      ? "正解です。"
      : `不正解です。正解は 『${classHash[correctClass]}』 です。`;

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
                value={userChosenClass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserChosenClass(e.target.value)
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
