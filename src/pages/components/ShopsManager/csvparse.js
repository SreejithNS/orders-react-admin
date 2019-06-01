var db = firebase.firestore();
var batch = db.batch()
in you array add updates

array.forEach((doc) => {
  var docRef = db.collection("col").doc(); //automatically generate unique id
  batch.set(docRef, doc);
});
finally you have to commit that

batch.commit()