import firebase from "../firebase/clientApp";

export const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
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
  //以下で、フォルダーをひとつ選んでいるが、フォルダーによって格納されている画像の数が違うため、全てのフォルダの画像をリストしてflattenが必要化。
  const folderRefsArray = await Promise.all(
    prefixes.map((folderRef) => folderRef.listAll())
  );
  const allImgRefs = folderRefsArray
    .flat()
    .map((imgFolderListResult) => imgFolderListResult.items)
    .flat();
  const imgRef = allImgRefs[Math.floor(Math.random() * allImgRefs.length)];
  const targetImgUrl = await imgRef.getDownloadURL();
  const labelImgUrl = await storage
    .ref(imgRef.fullPath.replace("target", "label"))
    .getDownloadURL();
  return {
    target: targetImgUrl,
    label: labelImgUrl,
    path: imgRef.fullPath,
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

const getAnswerGridFromPixels = (pixels: [number, number][]) => {
  const gridLength = 4;
  const pixelPerGrid = 512 / gridLength;
  const answers = pixels.map((pixel) => [
    Math.ceil(pixel[0] / pixelPerGrid),
    Math.ceil(pixel[1] / pixelPerGrid),
  ]);
  return answers
};
