const functions = require('firebase-functions');

const express = require("express")
const upload = require("express-fileupload"),
  csvtojson = require("csvtojson");
/* Express */
const app1 = express();
app1.use(upload());

app1.post("*", (req, res) => {
/** convert req buffer into csv string ,
*   "csvfile" is the name of my file given at name attribute in input tag */

  csvData = req.files.csvfile.data.toString('utf8');
  return csvtojson().fromString(csvData).then(json =>
    {return res.status(201).json({csv:csvData, json:json})})
});

const api1 = functions.https.onRequest(app1)

module.exports = {
  api1
}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
