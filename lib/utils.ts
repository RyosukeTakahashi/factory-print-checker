import { classifications } from "../src/constants";
import firebase from "../firebase/clientApp";

export const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
};

export const formatTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  return `${YYYY}-${(MM > 9 ? "" : "0") + MM}-${(DD > 9 ? "" : "0") + DD} ${
    (hh > 9 ? "" : "0") + hh
  }:${(mm > 9 ? "" : "0") + mm}`;
};

type classCorrect = [string, number];

export const orderQuestionsInSession = (
  nthSession,
  userAnswers,
  answerRateBorder,
  questionOrderInSession
) => {
  const correctness = accumulatedClassesCorrectness(
    nthSession,
    userAnswers,
    questionOrderInSession
  );
  const entries = Object.entries(correctness).filter(
    (entry) => entry[1] < answerRateBorder / 100
  );
  const sortedEntries = entries.sort(
    (a: classCorrect, b: classCorrect) => a[1] - b[1]
  );
  console.log("sort_and_filtered_entries", sortedEntries);
  return sortedEntries.map((entry) => entry[0]);
};

export const getNextImagePath = async (targetPath) => {
  const storage = firebase.storage();
  const listResultDateFolder = await storage.ref().child(targetPath).listAll();
  const prefixes = listResultDateFolder.prefixes;
  const folderRef = prefixes[Math.floor(Math.random() * prefixes.length)];
  const listResultImgs = await folderRef.listAll();
  const imgRefs = listResultImgs.items;
  const imgRef = imgRefs[Math.floor(Math.random() * imgRefs.length)];
  const targetImgUrl = await imgRef.getDownloadURL();
  const labelImgUrl = await storage
    .ref(imgRef.location.path_.replace("target", "label"))
    .getDownloadURL();
  return {
    target: targetImgUrl,
    label: labelImgUrl,
  };
};

const accumulatedClassesCorrectness = (
  nthSession,
  userAnswers,
  questionOrderInSession
) => {
  return questionOrderInSession
    .slice()
    .sort(() => Math.random() - 0.5)
    .reduce((acc, classification) => {
      const classCorrectness = userAnswers.reduce((sum, session, index) => {
        return (
          sum +
          (session[classification]
            ? 2 ** (-1 * (nthSession - (index + 1) + 1))
            : 0)
        );
      }, 0);
      return Object.assign(acc, { [classification]: classCorrectness });
    }, {});
};
