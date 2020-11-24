import firebase from "../firebase/clientApp";

export const saveAnswerData = async (answer) => {
  const db = firebase.firestore();
  await db.collection(`answers`).add(answer);
};

export const getAnswers = async () => {
  const db = firebase.firestore();
  const snapShot = await db.collection(`answers`).get();
  const data = snapShot.docs.map((doc) => {
    return doc.data();
  });
  console.log(data);
  return data
};
