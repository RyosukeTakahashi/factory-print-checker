import {
  classifications,
  Pane,
  StyledLeftPaneRadioGroup,
} from "../src/constants";
import styled from "styled-components";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  accumulatedCorrectAnswerRateBorderAtom,
  correctClassAtom,
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
  questionOrderInSessionAtom,
} from "../src/atoms";
import * as React from "react";
import { getNextImagePath } from "../lib/utils";
import firebase from "../firebase/clientApp";

const StyledPane = styled(Pane)`
  border-right-width: medium;
  border-right-style: solid;
  margin-right: 40px;
  margin-left: 20px;
  padding-right: 20px;
`;

export default function LeftPane() {
  const [subjectId, setSubjectId] = useRecoilState(subjectIdAtom);
  const [selectedMode, setSelectedMode] = useRecoilState(questionModeAtom);
  const [showAnswer, setShowAnswer] = useRecoilState(showAnswerAtom);
  const [maxSessionCount, setMaxSessionCount] = useRecoilState(
    maxSessionCountAtom
  );
  const [started, setStarted] = useRecoilState(startedAtom);
  const setStartedTime = useSetRecoilState(sessionSetStartedTimeAtom);
  const [
    accumulatedCorrectAnswerRateBorder,
    setAccumulatedCorrectAnswerRateBorder,
  ] = useRecoilState(accumulatedCorrectAnswerRateBorderAtom);
  const setNthSession = useSetRecoilState(nthSessionAtom);
  const setNthQuestionInSession = useSetRecoilState(nthQuestionInSessionAtom);
  const setIsInGridSection = useSetRecoilState(isInGridSectionAtom);
  const setCorrectClass = useSetRecoilState(correctClassAtom);
  const setTargetImgUrl = useSetRecoilState(targetImgUrlAtom);
  const setLabelImgUrl = useSetRecoilState(labelImgUrlAtom);
  const setSessionStartedTime = useSetRecoilState(sessionStartedTimeAtom);
  const [questionOrderInSession, setQuestionOrderInSession] = useRecoilState(
    questionOrderInSessionAtom
  );

  const startSessionSet = async () => {
    const questionOrder = classifications
      .slice()
      .sort(() => Math.random() - 0.5); // randomize
    console.log("question_order: ", questionOrder);
    setQuestionOrderInSession(questionOrder);
    const nextClass = questionOrder[0];
    setCorrectClass(nextClass);
    const targetPath = `printer_test/target/${nextClass}/${selectedMode}`;
    const imgUrls = await getNextImagePath(targetPath);
    setTargetImgUrl(imgUrls.target);
    setLabelImgUrl(imgUrls.label);
    setSessionStartedTime(firebase.firestore.Timestamp.now());
    setStarted(true);
    setStartedTime(firebase.firestore.Timestamp.now());
    setNthSession(1);
    setNthQuestionInSession(1);
    setIsInGridSection(true);
  };

  //for development. and classification in constants, setclickedareas in index.
  useEffect(() => {
    startSessionSet().then();
    setSelectedMode("LF");
    setMaxSessionCount(4);
  }, []);

  return (
    <StyledPane>
      <div className={"mt-4"}>
        <TextField
          id="userIdNum"
          label="社員番号"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          disabled={started}
        />
      </div>

      <div className={"mt-8"}>方式選択</div>
      <FormControl component="fieldset" className="mode-select">
        <StyledLeftPaneRadioGroup
          aria-label="mode-select"
          name="mode-select"
          className="mode-select"
          value={selectedMode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedMode(e.target.value)
          }
        >
          <FormControlLabel
            value={"LF"}
            control={<Radio />}
            label="Low-First"
            disabled={started}
          />
          <FormControlLabel
            value={"SR"}
            control={<Radio />}
            label="単純反復"
            disabled={started}
          />
        </StyledLeftPaneRadioGroup>
      </FormControl>

      <div>正答表示</div>
      <FormControl component="fieldset" className="mode-select">
        <StyledLeftPaneRadioGroup
          aria-label="show-answer"
          name="show-answer"
          className="show-answer"
          value={showAnswer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShowAnswer(e.target.value)
          }
        >
          <FormControlLabel
            value={"true"}
            control={<Radio />}
            label="あり"
            disabled={started}
          />
          <FormControlLabel
            value={"false"}
            control={<Radio />}
            label="なし"
            disabled={started}
          />
        </StyledLeftPaneRadioGroup>
      </FormControl>
      <div className={"mt-4"}>
        <TextField
          id="trialCount"
          label="セッション回数"
          value={maxSessionCount}
          type={"number"}
          onChange={(e) => setMaxSessionCount(Number(e.target.value))}
          disabled={started}
        />
      </div>

      <div className={"mt-4"}>
        <TextField
          id="accumulatedCorrectAnswerRateBorder"
          label="累積正答率閾値"
          value={String(accumulatedCorrectAnswerRateBorder)}
          error={accumulatedCorrectAnswerRateBorder > 99}
          helperText={
            accumulatedCorrectAnswerRateBorder > 99 ? "1~99の値のみ可" : " "
          }
          type={"number"}
          onChange={(e) =>
            setAccumulatedCorrectAnswerRateBorder(Number(e.target.value))
          }
          disabled={started}
        />
      </div>

      <div className={"mt-6"}>
        <Button
          variant="contained"
          onClick={() => startSessionSet().then(() => {})}
          disabled={started || accumulatedCorrectAnswerRateBorder > 99}
        >
          {"計測を開始"}
        </Button>
      </div>
    </StyledPane>
  );
}
