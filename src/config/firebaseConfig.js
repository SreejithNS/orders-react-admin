import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

//Initialize Firebase
const config = {
    apiKey: "AIzaSyAbV6lbG1eMOuOVcNxJ5Nbih3Ngvw_Yc90",
    authDomain: "orders-pwa.firebaseapp.com",
    databaseURL: "https://orders-pwa.firebaseio.com",
    projectId: "orders-pwa",
    storageBucket: "orders-pwa.appspot.com",
    messagingSenderId: "219384534980"
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase