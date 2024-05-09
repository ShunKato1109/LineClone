import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage,ref,getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCwJ8ZZFAaJ-mvPjLb9GNZEem2tExHTrEc",
    authDomain: "line-tutrial.firebaseapp.com",
    projectId: "line-tutrial",
    storageBucket: "line-tutrial.appspot.com",
    messagingSenderId: "681261195831",
    appId: "1:681261195831:web:ffd1d462541916faed15b2",
    measurementId: "G-X7LB8HJ3ZK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// export default db;
// export default storage;
export {db,storage};