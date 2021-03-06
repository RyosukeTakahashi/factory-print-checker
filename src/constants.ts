import styled from "styled-components";
import RadioGroup from "@material-ui/core/RadioGroup";
import firebase from "../firebase/clientApp";

export const gridLength = 5;
const paneNames = ["leftPane", "centerPane"];
const paneWidth = ["230px", "1fr"];
export const appLayoutGridTemplate = `
"${paneNames.join(" ")}"
/ ${paneWidth.join(" ")}
`;
export const AppLayoutGrid = styled.div`
  display: grid;
  grid-template: ${appLayoutGridTemplate};
`;
export const Pane = styled.div`
  grid-area: ${(props) => props.area};
`;
export const StyledFlexRadioGroup = styled(RadioGroup)`
  justify-content: center;
`;
export const StyledLeftPaneRadioGroup = styled(RadioGroup)`
  font-size: 10px;
`;

export const classifications = [
  "doctor",
  "fisheye",
  "ink",
  "kaburi",
  "oyogi",
  "tutu",
  "nasi",
];

export const classHash = {
  nasi: "なし",
  doctor: "ドクター線",
  fisheye: "フィッシュアイ",
  ink: "インクはね",
  kaburi: "かぶり",
  oyogi: "およぎ",
  tutu: "ツーツー",
};

export const csvHeaders = [
  { label: "subjectId", key: "subjectId" },
  { label: "clickedAreas", key: "clickedAreas" },
  { label: "correctGrids", key: "correctGrids" },
  { label: "truePositiveGrids", key: "truePositiveGrids" },
  { label: "falsePositiveGrids", key: "falsePositiveGrids" },
  { label: "falseNegativeGrids", key: "falseNegativeGrids" },
  { label: "userChosenClass", key: "userChosenClass" },
  { label: "correctClass", key: "correctClass" },
  { label: "chosenClassCorrect", key: "chosenClassCorrect" },
  { label: "nthSession", key: "nthSession" },
  { label: "nthQuestionInSession", key: "nthQuestionInSession" },
  { label: "selectedMode", key: "selectedMode" },
  { label: "areaPickedTime", key: "areaPickedTime" },
  { label: "classPickedTime", key: "classPickedTime" },
  { label: "sessionStartedTime", key: "sessionStartedTime" },
  { label: "sessionSetStartedTime", key: "sessionSetStartedTime" },
  { label: "showAnswer", key: "showAnswer" },
  { label: "maxSessionCount", key: "maxSessionCount" },
  { label: "memo", key: "memo" },
  { label: "imgPath", key: "imgPath" },
  { label: "targetImgUrl", key: "targetImgUrl" },
];

export const cleanseData = (dataArray: firebase.firestore.DocumentData[]) => {
  return dataArray.map((sessionData) => {
    const areaPickedTime =
      sessionData.areaPickedTime.seconds +
      sessionData.areaPickedTime.nanoseconds * 10 ** -9;
    const classPickedTime =
      sessionData.classPickedTime.seconds +
      sessionData.classPickedTime.nanoseconds * 10 ** -9;
    const sessionStartedTime =
      sessionData.sessionStartedTime.seconds +
      sessionData.sessionStartedTime.nanoseconds * 10 ** -9;
    const sessionSetStartedTime =
      sessionData.sessionSetStartedTime.seconds +
      sessionData.sessionSetStartedTime.nanoseconds * 10 ** -9;
    const clickedAreas = String(sessionData.clickedAreas);
    const correctGrids = String(sessionData.correctGrids);
    const truePositiveGrids = String(sessionData.truePositiveGrids);
    const falsePositiveGrids = String(sessionData.falsePositiveGrids);
    const falseNegativeGrids = String(sessionData.falseNegativeGrids);
    return Object.assign(sessionData, {
      areaPickedTime,
      classPickedTime,
      sessionStartedTime,
      sessionSetStartedTime,
      clickedAreas,
      correctGrids,
      truePositiveGrids,
      falsePositiveGrids,
      falseNegativeGrids
    });
  });
};
