import Head from "next/head";
import Squares from "../components/Squares";
import {
  AppLayoutGrid,
  classHash,
  classifications,
  Pane,
} from "../src/constants";
import LeftPane from "../components/LeftPane";
import { Button } from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  accumulatedCorrectAnswerRateBorderAtom,
  areaPickedTimeAtom,
  classPickedTimeAtom,
  clickedAreasAtom,
  correctClassAtom,
  correctGridsAtom,
  falseNegativeGridsAtom,
  falsePositiveGridsAtom,
  imgPathAtom,
  isInAnswerRevealSectionAtom,
  isInClassifySectionAtom,
  isInGridSectionAtom,
  labelImgUrlAtom,
  maxSessionCountAtom,
  memoAtom,
  nthQuestionInSessionAtom,
  nthSessionAtom,
  questionModeAtom,
  questionOrderInSessionAtom,
  sessionSetStartedTimeAtom,
  sessionStartedTimeAtom,
  showAnswerAtom,
  startedAtom,
  subjectIdAtom,
  targetImgUrlAtom,
  truePositiveGridsAtom,
  userChosenClassAtom,
} from "../src/atoms";
import { saveAnswerData } from "../src/fetchers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as React from "react";
import { useEffect, useState } from "react";
import AnnotatedImage from "../components/AnnotatedImage";
import {
  getCorrectGrids,
  getNextImagePath,
  orderQuestionsInSession,
} from "../lib/utils";
import firebase from "../firebase/clientApp";
import RadioGroup from "@material-ui/core/RadioGroup";
import path from "path";
import fs from "fs";
import { GetStaticProps } from "next";
import { AnswerResultTable } from "../components/AnswerResultTable";

//余裕あれば: background image preload, css multiple background, content-url。
//余裕あれば: firebaseプロジェクト作成
//余裕あれば: アカウントに画像アップロード

export default function Home({ gridAnswer }) {
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
  const memo = useRecoilValue(memoAtom);
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
  const [correctGrids, setCorrectGrids] = useRecoilState(correctGridsAtom);
  const truePositiveGrids = useRecoilValue(truePositiveGridsAtom);
  const falsePositiveGrids = useRecoilValue(falsePositiveGridsAtom);
  const falseNegativeGrids = useRecoilValue(falseNegativeGridsAtom);
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
  const [imgPath, setImgPath] = useRecoilState(imgPathAtom);

  const moveToGridPickSection = async (nextClass) => {
    setIsInAnswerRevealSection(false);
    setIsInGridSection(true);
    setCorrectClass(nextClass);
    const targetPath = `printer_test/target/${nextClass}/${selectedMode}`;
    const imgUrls = await getNextImagePath(targetPath);
    setTargetImgUrl(imgUrls.target);
    setLabelImgUrl(imgUrls.label);
    setImgPath(imgUrls.path);
    setSessionStartedTime(firebase.firestore.Timestamp.now());
  };

  //gridAnswerを使い, それをpropバケツリレーするのが嫌だったため、useEffectでrecoilにわたす、
  useEffect(() => {
    if (started) {
      setCorrectGrids(getCorrectGrids(gridAnswer, imgPath));
    }
  }, [imgPath, started]);

  const moveToNextStep = async () => {
    const chosenClassCorrect = userChosenClass === correctClass;
    const answer = {
      subjectId,
      selectedMode,
      showAnswer,
      nthSession,
      nthQuestionInSession,
      targetImgUrl,
      imgPath,
      clickedAreas,
      userChosenClass,
      correctClass,
      correctGrids,
      truePositiveGrids,
      falsePositiveGrids,
      falseNegativeGrids,
      maxSessionCount,
      chosenClassCorrect,
      sessionSetStartedTime,
      sessionStartedTime,
      areaPickedTime,
      classPickedTime,
      memo,
    };
    await saveAnswerData(answer);

    // [{ oyogi: false }] から { oyogi: false, doctor: true }を出力。
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

    setClickedAreas([]); //for development
    setUserChosenClass(""); //for development
    const nextNthQuestion = nthQuestionInSession + 1;

    //goto next session if all classes are questioned.
    if (questionOrderInSession.length < nextNthQuestion) {
      const nextNthSession = nthSession + 1;
      const newQuestionOrder =
        selectedMode === "SR"
          ? classifications.slice().sort(() => Math.random() - 0.5)
          : orderQuestionsInSession(
              nextNthSession - 1,
              newUserAnswersInSessionSet,
              accumulatedCorrectAnswerRateBorder,
              questionOrderInSession
            );
      console.log("new question order:", newQuestionOrder);
      if (maxSessionCount < nextNthSession || newQuestionOrder.length === 0) {
        setIsInAnswerRevealSection(false);
        setUserAnswersInSessionSet([{}]);
        setStarted(false); //end sessionSet
        return;
      }
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

  const nextButton = (() => {
    if (isInGridSection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => {
            setAreaPickedTime(firebase.firestore.Timestamp.now());
            setIsInGridSection(false);
            setIsInClassifySection(true);
          }}
        >
          選択した箇所で回答する
        </Button>
      );
    if (isInClassifySection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          disabled={userChosenClass === ""}
          onClick={() => {
            setClassPickedTime(firebase.firestore.Timestamp.now());
            setIsInClassifySection(false);
            setIsInAnswerRevealSection(true);
          }}
        >
          選択した分類で回答する
        </Button>
      );
    if (isInAnswerRevealSection)
      return (
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={() => moveToNextStep()}
        >
          次の問題に行く
        </Button>
      );
  })();

  const answerMessage =
    userChosenClass === correctClass
      ? "分類：正解です。"
      : `分類：不正解です。正解は 『${classHash[correctClass]}』 です。`;

  const classOptions = Object.keys(classHash).map((key) => (
    <FormControlLabel
      value={key}
      control={<Radio />}
      label={classHash[key]}
      key={key}
      disabled={isInAnswerRevealSection}
    />
  ));

  const showAnnotation = isInAnswerRevealSection && showAnswer === "true";

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
            <main className={"flex justify-start"}>
              <Squares />
              {showAnnotation && <AnnotatedImage />}
            </main>

            {(isInClassifySection || isInAnswerRevealSection) && (
              <RadioGroup
                row
                name="class-selection"
                value={userChosenClass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserChosenClass(e.target.value)
                }
              >
                {classOptions}
              </RadioGroup>
            )}

            {showAnnotation && (
              <>
                <div className={"text-3xl"}>{answerMessage}</div>
                <AnswerResultTable />
              </>
            )}
            <div className={"mt-8"}>{nextButton}</div>
          </Pane>
        )}
      </AppLayoutGrid>
    </>
  );
}

const gridAnswerJsonPath = path.join(process.cwd(), "/pages/gridAnswer.json");

export const getStaticProps: GetStaticProps = async () => {
  const gridAnswer = JSON.parse(fs.readFileSync(gridAnswerJsonPath, "utf-8"));
  return {
    props: { gridAnswer },
  };
};
