import {
  createGenerateClassName,
  createMuiTheme,
} from "@material-ui/core/styles";
import styled from "styled-components";
import RadioGroup from "@material-ui/core/RadioGroup";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";

export const gridLength = 5;
export const DataCollectionModeStr = "DataCollection";
export const AnsweringModeStr = "Answering";
const paneNames = ["leftPane", "centerPane"];
const paneWidth = ["230px", "1fr"];
export const appLayoutGridTemplate = `
"${paneNames.join(" ")}"
/ ${paneWidth.join(" ")}
`;
export const generateClassName = createGenerateClassName();
export const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: "0.9rem",
        // useNextVariants: true,
      },
    },
  },
});
export const AppLayoutGrid = styled.div`
  display: grid;
  grid-template: ${appLayoutGridTemplate};
`;
export const Pane = styled.div`
  grid-area: ${(props) => props.area};
`;
export const StyledPaper = styled(Paper)`
  width: 800px;
  margin: 100px 0;
`;
export const StyledToolbar = styled(Toolbar)`
  background: aliceblue;
  font-size: 28px;
`;
export const StyledFormControl = styled(FormControl)`
  && {
    min-width: 150px;
    margin-top: 20px;
  }
`;
export const StyledTextField = styled(TextField)`
  margin-top: -8px;
`;
export const StyledFlexRadioGroup = styled(RadioGroup)`
  justify-content: center;
`;
export const StyledFormGroup = styled(FormGroup)`
  max-width: 900px;
`;

export const StyledLeftPaneRadioGroup = styled(RadioGroup)`
  font-size: 10px;
`;

export const classes = [
  "doctor",
  "fisheye",
  "ink",
  "kaburi",
  "oyogi",
  "tutu",
  "nasi",
];

export const classHash = {
  doctor: "ひげ",
  fisheye: "フィシュアイ",
  ink: "インク",
  kaburi: "かぶり",
  oyogi: "およぎ",
  tutu: "つつ",
  nasi: "なし"
};
