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
  memoAtom,
} from "../src/atoms";
import { saveAnswerData } from "../src/fetchers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as React from "react";
import AnnotatedImage from "../components/AnnotatedImage";
import { getNextImagePath, orderQuestionsInSession } from "../lib/utils";
import firebase from "../firebase/clientApp";
import { useState } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";

//todo: firebaseプロジェクト作成
//todo: アカウントに画像アップロード

//todo: 画像表示なしのときに時間を送るタイミング must　(useEffect の depsをボタンの押下にする？
//todo: 画像ダウンロード機能
//todo: ファイル名調整して、1つのファイルにいれる。or flattenしてから・・・？
//todo: 画像表示遅い問題

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
      const newQuestionOrder = orderQuestionsInSession(
        nextNthSession - 1,
        newUserAnswersInSessionSet,
        accumulatedCorrectAnswerRateBorder,
        questionOrderInSession
      );
      console.log("new quesiton order:", newQuestionOrder);
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
            if (showAnswer === "true") {
              setIsInAnswerRevealSection(true);
            } else {
              setIsInClassifySection(false);
              moveToNextStep().then(() => {});
            }
          }}
        >
          選択した分類で回答する
        </Button>
      );
    if (isInAnswerRevealSection)
      return (
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => moveToNextStep()}
        >
          次の問題に行く
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
            <main className={"flex justify-start"}>
              <Squares />
              {isInAnswerRevealSection && <AnnotatedImage />}
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

            {isInAnswerRevealSection && (
              <div className={"text-3xl"}>{answerMessage}</div>
            )}
            <div className={"mt-8"}>{nextButton}</div>
          </Pane>
        )}
      </AppLayoutGrid>
    </>
  );
}
