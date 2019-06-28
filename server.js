const express = require('express');
const app = express();
// define our app using express
var bodyParser = require('body-parser');
//var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//var port = process.env.PORT || 5000;        // set our port
const port = 5000;        // set default port
var router = express.Router();              // get an instance of the express Router
var firebase = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://microservices-7f018.firebaseio.com"
});
var db = firebase.database();

app.use('/api', router);
app.listen(port);


app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});


//app.listen(port, () => `Server running on port ${port}`);

// Start user Registation 
var usersdbref = db.ref("users");
var usersList = [];

function getUsersList(){
  usersdbref.once("value", function(snapshot) {
    console.log(snapshot.val());
    usersList = snapshot.val();
  });
};

function upsertUser(user){  
  var usersdbref = db.ref("users/" + user.userName);
  usersdbref.set(user);    
};

const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

// http://localhost:5000/api/v1/users
app.get('/api/v1/users', function(req, res) {  
  var returnArr = [];
  usersdbref.once("value", function(snapshot) {
    //var item = snapshot.val();
    //returnArr.push(item);
    //console.log(snapshotToArray(snapshot.val()));  
    returnArr = snapshotToArray(snapshot.val());
    //console.log(returnArr);        
    res.json(returnArr);   
  });  
});

// http://localhost:5000/api/v1/user
app.post('/api/v1/user', (req, res) => {
  if(!req.body) {
    return res.status(400).send({
      success: 'false',
      message: 'data not found!'
    });
  }

  var user = req.body;
  upsertUser(user);
  getUsersList();

 return res.status(201).send({
   success: 'true',
   message: 'added successfully'
 })
});

// http://localhost:5000/api
router.get('/', function(req, res) {    
  res.writeHead(200, { 'Content-Type': 'text/html' });
  ///fs.readFile('./app/index.html', null, function(error, data){
  // if(error){
  //   res.writeHead(404);
  //   res.write("File not found");
  // }else{
    //res.write(data);
  //}
  //});

res.end();    
});

// End user Registation 