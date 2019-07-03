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

exports.setSale = functions.firestore.document('sales/{saleId}').onCreate((sale, context) => {
  const id = sale.data().salesman.uid;
  admin.firestore().collection('users').doc(id).update({
    "onSale":true,
    "saleId":sale.id
  }).then(()=>console.log("SALES CREATED ON USER:",id,"Sale Id",sale.id))
})

exports.updateSaleContainer = functions.firestore.document('orders/{orderId}').onCreate((order, context) => {
  if(order.data().onSale){
    var groupBy = function(xs, key) {return xs.reduce(function(rv, x) {(rv[x[key]] = rv[x[key]] || []).push(x);return rv;}, {});};
    const saleId = order.data().saleId;
    var orderItems = order.data().order;
    var credit = order.data().credit;
    var creditAmount = order.data().creditAmount;
    var discountAmount = order.data().discount? parseInt(order.data().discountAmount) : 0;
    var docRef = admin.firestore().collection("sales").doc(saleId);

    return admin.firestore().runTransaction((transaction)=>{
        var orderedItems = groupBy(orderItems,"itemCode");
        return transaction.get(docRef).then((doc)=>{

          var containerItems = doc.data().containerReturn;
          var returnAmount = doc.data().returnAmount;
          var saleCredits = doc.data().creditAmount;
          var newDiscountAmount = doc.data().discountAmount  + parseInt(discountAmount);
          
          for(var itemCode in orderedItems){
            //eslint-disable-next-line
           var index = containerItems.findIndex(item=>item.itemCode === itemCode)
           returnAmount += parseInt(orderedItems[itemCode][0].amount);
           containerItems[index].quantity = parseInt(containerItems[index].quantity) - parseInt(orderedItems[itemCode][0].quantity);
          }
          
          returnAmount -= discountAmount;
          if(credit) {saleCredits+=creditAmount;returnAmount-=creditAmount}
          return transaction.update(docRef, {containerReturn:containerItems,returnAmount,creditAmount:saleCredits,discountAmount:newDiscountAmount});
        });
    }).then(function() {
        console.log(`Sale id:${saleId},container updated!`);
    }).catch(function(error) {
        console.log(`Sale id:${saleId},container update Error`, error);                                                                                                                    
    });
  }else{
    return console.log(`Order received without saleId`)
  }
})

exports.handleOrderDelete = functions.firestore.document('orders/{orderId}').onDelete((order, context) => {
  if(order.data().onSale){
    var groupBy = function(xs, key) {return xs.reduce(function(rv, x) {(rv[x[key]] = rv[x[key]] || []).push(x);return rv;}, {});};
    const saleId = order.data().saleId;
    var orderItems = order.data().order;
    var credit = order.data().credit;
    var creditAmount = order.data().creditAmount;
    var discountAmount = order.data().discount? parseInt(order.data().discountAmount) : 0;
    var docRef = admin.firestore().collection("sales").doc(saleId);

    return admin.firestore().runTransaction((transaction)=>{
        var orderedItems = groupBy(orderItems,"itemCode");
        return transaction.get(docRef).then((doc)=>{
          var onSale = doc.data().status==="On-Sale";
          if(!onSale) return console.log('Order is deleted from completed sale.');
          var containerItems = doc.data().containerReturn;
          var returnAmount = doc.data().returnAmount;
          var saleCredits = doc.data().creditAmount;
          var newDiscountAmount = doc.data().discountAmount - parseInt(discountAmount);
          
          for(var itemCode in orderedItems){
            //eslint-disable-next-line
           var index = containerItems.findIndex(item=>item.itemCode === itemCode)
           returnAmount -= parseInt(orderedItems[itemCode][0].amount);
           containerItems[index].quantity = parseInt(containerItems[index].quantity) + parseInt(orderedItems[itemCode][0].quantity);
          }
          
          returnAmount += discountAmount;
          if(credit) {saleCredits-=creditAmount;returnAmount+=creditAmount}
          return transaction.update(docRef, {containerReturn:containerItems,returnAmount,creditAmount:saleCredits,discountAmount:newDiscountAmount});
        });
    }).then(function() {
        console.log(`Sale id:${saleId},container updated with deleted order`);
    }).catch(function(error) {
        console.log(`Sale id:${saleId},container update Error`, error);                                                                                                                    
    });
  }else{
    return console.log(`Order deleted without saleId`)
  }
});