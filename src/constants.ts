import styled from "styled-components";
import RadioGroup from "@material-ui/core/RadioGroup";

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
  { label: "chosenClassCorrect", key: "chosenClassCorrect" },
  { label: "correctClass", key: "correctClass" },
  { label: "maxSessionCount", key: "maxSessionCount" },
];
