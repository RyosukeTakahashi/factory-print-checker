import firebase from "../firebase/clientApp";

export const saveAnswerData = async (answer) => {
  const db = firebase.firestore();
  await db.collection(`answers`).add(answer);
};
