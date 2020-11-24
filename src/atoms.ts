import { atom } from "recoil";
import firebase from "firebase/app";
import "firebase/firestore";

export const gridLengthAtom = atom({
  key: "gridLength",
  default: 4,
});

export const clickedAreasAtom = atom({
  key: "clickedAreas",
  default: [],
});

export const nthQuestionInSessionAtom = atom({
  key: "nthQuestionInSession",
  default: 0,
});

export const nthSessionAtom = atom({
  key: "nthSession",
  default: 0,
});

export const maxSessionCountAtom = atom({
  key: "maxSessionCount",
  default: 7,
});

export const questionModeAtom = atom({
  key: "mode",
  default: "SR",
});

export const showAnswerAtom = atom({
  key: "showAnswer",
  default: "true",
});

export const questionOrderInSessionAtom = atom({
  key: "questionOrderInSession",
  default: [],
});

export const startedAtom = atom({
  key: "started",
  default: false,
});

export const sessionSetStartedTimeAtom = atom({
  key: "startedTime",
  default: firebase.firestore.Timestamp.now(),
});

export const sessionStartedTimeAtom = atom({
  key: "sessionStartedTime",
  default: firebase.firestore.Timestamp.now(),
});

export const areaPickedTimeAtom = atom({
  key: "areaPickedTime",
  default: firebase.firestore.Timestamp.now(),
});

export const classPickedTimeAtom = atom({
  key: "classPickedTime",
  default: firebase.firestore.Timestamp.now(),
});

export const userChosenClassAtom = atom({
  key: "chosenClass",
  default: "",
});

export const correctClassAtom = atom({
  key: "correctClass",
  default: "hige",
});

export const subjectIdAtom = atom({
  key: "subjectId",
  default: "0",
});

export const memoAtom = atom({
  key: "memo",
  default: "",
});

export const isInClassifySectionAtom = atom({
  key: "isInClassifySection",
  default: false,
});

export const isInGridSectionAtom = atom({
  key: "isInGridSection",
  default: false,
});

export const isInAnswerRevealSectionAtom = atom({
  key: "isInAnswerRevealSection",
  default: false,
});

export const accumulatedCorrectAnswerRateBorderAtom = atom({
  key: "accumulatedCorrectAnswerRateBorder",
  default: 75,
});

export const targetImgUrlAtom = atom({
  key: "targetImgUrls",
  default: "http://placehold.jp/150x150.png",
});

export const labelImgUrlAtom = atom({
  key: "labelImgUrls",
  default: "http://placehold.jp/150x150.png",
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
