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
  doctor: "ドクター線",
  fisheye: "フィッシュアイ",
  ink: "インク",
  kaburi: "かぶり",
  oyogi: "およぎ",
  tutu: "ツーツー",
  nasi: "なし",
};

export const csvHeaders = [
  { label: "subjectId", key: "subjectId" },
  { label: "clickedAreas", key: "clickedAreas" },
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
  { label: "targetImgUrl", key: "targetImgUrl" },
  { label: "showAnswer", key: "showAnswer" },
  { label: "maxSessionCount", key: "maxSessionCount" },
  { label: "memo", key: "memo" },
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
    return Object.assign(sessionData, {
      areaPickedTime,
      classPickedTime,
      sessionStartedTime,
      sessionSetStartedTime,
      clickedAreas,
    });
  });
};
