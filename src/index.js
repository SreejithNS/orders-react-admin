import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from 'react-router-dom';
import store from './redux/store';
import {Provider} from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import 'typeface-roboto';

store.subscribe(()=>{
    return true
});




store.firebaseAuthIsReady.then(()=>{
    store.firestore.collection('admin').doc('app-settings').get().then(doc=>{
        store.dispatch({
            type:"SET_SETTINGS",
            payload:doc.data()
        })
        ReactDOM.render(
        <Provider store={store}>
            <Router>
                <CssBaseline />
                <App />
            </Router>
        </Provider>
        , document.getElementById('root'));
    })
})
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
