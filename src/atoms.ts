import { atom } from "recoil";
import { CalendlyState } from "../components/Calendly";

export const gridLengthAtom = atom({
  key: "gridLength",
  default: 4,
});

export const clickedAreasAtom = atom({
  key: "clickedAreas",
  default: [3, 4],
});

export const nthQuestionInSessionAtom = atom({
  key: "nthQuestionInSession",
  default: 1,
});

export const nthSessionAtom = atom({
  key: "nthSession",
  default: 1,
});

export const maxSessionCountAtom = atom({
  key: "maxSessionCount",
  default: 7,
});

export const questionModeAtom = atom({
  key: "mode",
  default: "LF",
});

export const showAnswerAtom = atom({
  key: "showAnswer",
  default: "true",
});

export const startedAtom = atom({
  key: "started",
  default: false
});

export const startedTimeAtom = atom({
  key: "startedTime",
  default: Date.now()
});

export const subjectIdAtom = atom({
  key: "subjectId",
  default: "0"
});

export const accumulatedCorrectAnswerRateBorderAtom = atom({
  key: "accumulatedCorrectAnswerRateBorder",
  default: 75
});

export const imgUrlsAtom = atom({
  key: "imgUrls",
  default: {
    inj: "http://placehold.jp/150x150.png",
    ref: "http://placehold.jp/006699/cccc00/150x150.png",
  },
});

export const radioAnswerWithName = (questionName: string) => {
  return atom({
    key: `radioAnswer-${questionName}`,
    default: "",
  });
};

export const checkboxAnswerWithName = (questionName: string) => {
  return atom({
    key: `checkboxAnswer-${questionName}`,
    default: [],
  });
};

export const reservationsAtom = atom({
  key: "reservations",
  default: null as Reservation[],
});

export const otherTalkThemeAtom = atom({
  key: "talkTheme",
  default: "",
});

export const howFoundMurakamiAtom = atom({
  key: "howFoundMurakami",
  default: "",
});

export const seikakuNaviAtom = atom({
  key: "seikakuNavi",
  default: "",
});

export const calendlyStateAtom = atom({
  key: "calendlyState",
  default: CalendlyState.unshown,
});

export const otherOBTalkAtom = atom({
  key: "otherOBTalk",
  default: "",
});

export const reservationDateAtom = atom({
  key: "reservationDate",
  default: "YYYY-MM-DD",
});

type CalendlySetting = {
  url: string;
  prefill: {
    name: string;
    email: string;
    customAnswers: {
      a1: string;
    };
  };
  styles: {
    height: string;
  };
  text: string;
};

const defaultCalendlySetting: CalendlySetting = {
  url: "https://calendly.com/ryo-murakami/meeting",
  prefill: {
    name: "",
    email: "",
    customAnswers: {
      a1: "",
    },
  },
  styles: {
    height: "850px",
  },
  text: "予約はこちらから",
};

export const calendlySettingAtom = atom({
  key: "calendlyState",
  default: defaultCalendlySetting,
});

export const myPageSnackBarAtom = atom({
  key: "myPageSnackBar",
  default: false,
});

const defaultUser: User = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
};

export const userAtom = atom({
  key: "user",
  default: defaultUser,
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: true,
});
