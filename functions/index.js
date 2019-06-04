const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createProfile = functions.auth.user().onCreate((user) => {
  var dp,phone,name;
  const {displayName,uid,phoneNumber,email,photoURL} = user;
  name=displayName;
  phone=phoneNumber;
  dp=photoURL;
  admin.firestore().collection('admin').doc('appSettings').get().then(doc=>{
    return admin.firestore().collection('users').doc(uid).set(
      {dp,phone,name,uid,email,settings:doc.data()}
    )
  }).then(()=>console.log("New User created!"))
});
