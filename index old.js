const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const bodyparser = require('body-parser');
var admin = require("firebase-admin");
var {getDatabase} = require("firebase-admin/database");

var serviceAccount = require("./task-manager-df244-firebase-adminsdk-ra5s6-a5e9814981.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-manager-df244-default-rtdb.firebaseio.com"
});

const db = getDatabase();

app.use(cors());
app.use(bodyparser.json());

app.get('/users', (req, res) => {

  const users = [
    { 
      id: 1,
      username: "Thanish Ahamed",
      email: "abc@gmail.com",
      password: "2345",
      permission: 100
    },
    { 
      id: 2,
      username: "Mohammed Ammar",
      email: "ammar@gmail.com",
      password: "1011",
      permission: 1
    },
  ];

  res.json(users);
});

app.get("/saveUser", (req,res) => {
    let count = 0;

    let ref = db.ref('server/users');

    ref.on('child_added', (snap) => {
      count++;
      console.log('added:', snap.key);
    });
    
    // length will always equal count, since snap.val() will include every child_added event
    // triggered before this point
    ref.once('value', (snap) => {
      console.log('initial data loaded!', snap.numChildren() === count);
    });

    // ref = db.ref('server');
    
    // const usersRef = ref.child('users');
    // usersRef.set({
    //   alanisawesome: {
    //     date_of_birth: 'June 23, 1912',
    //     full_name: 'Alan Turing'
    //   },
    //   gracehop: {
    //     date_of_birth: 'December 9, 1906',
    //     full_name: 'Grace Hopper'
    //   }
    // });

    res.json({message: 'success'});
});

app.get("/updateUser", (req, res) => {
  const ref = db.ref('server/saving-data/fireblog');
  const usersRef = ref.child('users');
  const hopperRef = usersRef.child('gracehop');
  hopperRef.update({
    'nickname': 'Amazing Grace But Updated by thanish',
    'full_name': 'Thanish Ahamed',
    'address': 'GrassLand'
  }, (error) => {
    if(error) {
      console.log(error);
    }else {
      console.log('Successfull')
    }
  });

  res.json({message: 'success'});
});
app.get("/deleteUser", (req, res) => {

  res.json({message: 'success'});
});
app.get("/getUsers", (req, res) => {

  const ref = db.ref('server/saving-data/fireblog/users');

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on('value', (snapshot) => {
    console.log(snapshot.val());
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
  }); 

  res.json({message: 'success'});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})