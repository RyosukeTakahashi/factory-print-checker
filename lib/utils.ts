import { classes } from "../src/constants";
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

export const chooseNextClass = (selectedMode) => {
  switch (selectedMode) {
    case "LF":
      return chooseClassByLF();
    case "SR":
      return chooseClassBySR();
  }
};
const chooseClassBySR = () =>
  classes[Math.floor(Math.random() * classes.length)];
const chooseClassByLF = () =>
  classes[Math.floor(Math.random() * classes.length)];

export const getNextImagePath = async (targetPath) => {
  const storage = firebase.storage();
  const listResultDateFolder = await storage
      .ref()
      .child(targetPath)
      .listAll();
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
