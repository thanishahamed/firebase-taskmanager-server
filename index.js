const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyparser = require("body-parser");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const {
  loadUsers,
  saveUser,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("./controllers/UserController");
const serviceAccount = require("./firebase_sdk.json");

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

app.use(cors());
app.use(bodyparser.json());

//user api routes
app.get("/users", (req, res) => loadUsers(req, res, db));
app.post("/saveUser", (req, res) => saveUser(req, res, db));
app.put("/updateUser", (req, res) => updateUser(req, res, db));
app.post("/deleteUser", (req, res) => deleteUser(req, res, db));
app.post("/getSingleUser", (req, res) => getSingleUser(req, res, db));

//task api routes

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
