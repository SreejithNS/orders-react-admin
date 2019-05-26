import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import user from './reducers/userReducer';
import { reduxFirestore,getFirestore } from 'redux-firestore';
import { reactReduxFirebase,getFirebase } from 'react-redux-firebase';
import thunk from "redux-thunk";
import {compose} from "redux"
import firebase from '../config/firebaseConfig';
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase"

const store = createStore(combineReducers({
        user,
        firestore:firestoreReducer,
        firebase:firebaseReducer
    }),{},
    compose(
        applyMiddleware(logger,thunk.withExtraArgument({getFirebase,getFirestore})),
        reduxFirestore(firebase),
        reactReduxFirebase(firebase,{useFirestoreForProfile:true,userProfile:'users',attachAuthIsReady:true})
    )
);

firebase.auth().onAuthStateChanged((user) =>{
    if(user){
        let uid = user.uid;
        let name = user.displayName;
        let photoURL = user.photoURL;
        store.dispatch({type:'USER_LOGGED',payload:{uid,name,photoURL}});
    }
});

export default store;