import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { userAtom, userLoadingAtom } from "../src/atoms";

export const useUser = (): [User, SetterOrUpdater<User>, boolean] => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loadingUser, setLoadingUser] = useRecoilState(userLoadingAtom);

  useEffect(() => {
    // Listen authenticated user
    // https://firebase.google.com/docs/auth/web/manage-users
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          const db = firebase.firestore();
          const userDocRef = db.doc(`users/${uid}`);
          const userDoc = await userDocRef.get();
          //add user to firestore if no document.
          if (userDoc.data() === undefined) {
            const createdAt = Date.now();
            await db.collection("users").doc(uid).set({
              displayNameInApp: displayName,
              photoURL,
              email,
              createdAt,
            });
          }
          setUser({ uid, displayName, email, photoURL });
        } else setUser(null);
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return [user, setUser, loadingUser];
};
