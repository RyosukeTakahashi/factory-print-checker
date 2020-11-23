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
  questionOrderInSessionAtom,
  accumulatedCorrectAnswerRateBorderAtom,
} from "../src/atoms";
import { saveAnswerData } from "../src/fetchers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as React from "react";
import AnnotatedImage from "../components/AnnotatedImage";
import { getNextImagePath, orderQuestionsInSession } from "../lib/utils";
import firebase from "../firebase/clientApp";
import { useState } from "react";
import { useEffect } from "react";

//todo: QA
//todo: firebaseプロジェクト作成
//todo: 有馬アカウントに画像アップロード
//todo: vercel deploy (env設定
//todo: squares動かないようにする

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
  const [questionOrderInSession, setQuestionOrderInSession] = useRecoilState(
    questionOrderInSessionAtom
  );
  const accumulatedCorrectAnswerRateBorder = useRecoilValue(
    accumulatedCorrectAnswerRateBorderAtom
  );
  const subjectId = useRecoilValue(subjectIdAtom);
  const selectedMode = useRecoilValue(questionModeAtom);
  const showAnswer = useRecoilValue(showAnswerAtom);
  const sessionSetStartedTime = useRecoilValue(sessionSetStartedTimeAtom);
  const [userAnswersInSessionSet, setUserAnswersInSessionSet] = useState([{}]);

  const moveToGridPickSection = async (nextClass) => {
    setIsInAnswerRevealSection(false);
    setIsInGridSection(true);
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

  const moveToNextStep = async () => {
    const chosenClassCorrect = userChosenClass === correctClass;
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
      chosenClassCorrect,
      sessionSetStartedTime,
      sessionStartedTime,
      areaPickedTime,
      classPickedTime,
    };
    await saveAnswerData(answer);

    // [{ oyogi: false }] から { oyogi: false, doctor: true }を出力。
    console.log("userAnswers", userAnswersInSessionSet);
    console.log("nthSession", nthSession);
    const answersInSession = Object.assign(
      userAnswersInSessionSet[nthSession - 1],
      {
        [correctClass]: chosenClassCorrect,
      }
    );
    // [{ oyogi: false }];をimmutableに、[{ oyogi: false, doctor: true }]に変える
    //新しいセッションの場合、
    //[{ oyogi: false, doctor: true }, {}]ををimmutableに[{ oyogi: false, doctor: true }, {oyogi: false}] に変える
    const newUserAnswersInSessionSet = Object.assign(
      [],
      userAnswersInSessionSet,
      {
        [nthSession - 1]: answersInSession,
      }
    );
    console.log("new userAnswers", newUserAnswersInSessionSet);
    setUserAnswersInSessionSet(newUserAnswersInSessionSet);

    setClickedAreas([1, 2]); //for developement
    setUserChosenClass("nasi"); //for developement
    const nextNthQuestion = nthQuestionInSession + 1;

    //goto next session if all classes are questioned.
    if (questionOrderInSession.length < nextNthQuestion) {
      const nextNthSession = nthSession + 1;
      const newQuestionOrder = orderQuestionsInSession(
        nextNthSession - 1,
        newUserAnswersInSessionSet,
        accumulatedCorrectAnswerRateBorder,
        questionOrderInSession
      );
      if (maxSessionCount < nextNthSession || newQuestionOrder.length === 0) {
        setIsInAnswerRevealSection(false);
        setUserAnswersInSessionSet([{}]);
        setStarted(false); //end sessionSet
        return;
      }
      // console.log(newQuestionOrder);
      setNthSession(nextNthSession);
      setUserAnswersInSessionSet(userAnswersInSessionSet.concat([{}]));
      setQuestionOrderInSession(newQuestionOrder);
      setNthQuestionInSession(1);
      moveToGridPickSection(newQuestionOrder[0]).then(() => {});
    } else {
      //goto next question
      await setNthQuestionInSession(nextNthQuestion);
      moveToGridPickSection(
        questionOrderInSession[nextNthQuestion - 1]
      ).then(() => {});
    }
  };

  //for development.
  useEffect(() => {
    setUserChosenClass("fisheye");
  }, []);

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
          onClick={() => moveToNextStep()}
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
