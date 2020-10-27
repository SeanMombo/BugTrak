import firebase from 'firebase/app';
import 'firebase/firestore';;

const firebaseConfig = {
    apiKey: "AIzaSyC7J1Jfu8DnMaKYK7XZmwymosz5w5xpluM",
    authDomain: "bugtrak-ff53f.firebaseapp.com",
    databaseURL: "https://bugtrak-ff53f.firebaseio.com",
    projectId: "bugtrak-ff53f",
    storageBucket: "bugtrak-ff53f.appspot.com",
    messagingSenderId: "829003961471",
    appId: "1:829003961471:web:708f796070d53e1a49db4a",
    measurementId: "G-TFB7THVC8J"
};
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export default firebase;

///////////////////////////////////////////////////////////////////////////////

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);

    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc();
        batch.set(newDocRef, obj);
    });

    return await batch.commit();
}

export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
        const { displayName, email, userType } = doc.data();

        return {
            id: doc.id,
            displayName,
            email,
            userType,
        }
    })

    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.id] = collection;
        return accumulator;
    }, {});
}

