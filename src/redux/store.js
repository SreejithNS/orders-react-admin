import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import { reduxFirestore,getFirestore } from 'redux-firestore';
import { reactReduxFirebase,getFirebase } from 'react-redux-firebase';
import thunk from "redux-thunk";
import {compose} from "redux"
import firebase from '../config/firebaseConfig';
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase"
import user from './reducers/userReducer';
import ui from "./reducers/uiReducer"
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;



const store = createStore(combineReducers({
        user,
        ui,
        firestore:firestoreReducer,
        firebase:firebaseReducer
    }),{},
    composeEnhancers(
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