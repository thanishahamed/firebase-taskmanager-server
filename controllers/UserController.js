const loadUsers = async (req, res, db) => {

  const snapshot = await db.collection('users').get();

  const users = [];
  const data = snapshot.forEach(doc => {
    users.push({id: doc.id, ...doc.data()})
  });

  const doc = db.collection('users').doc('9GVa6aD3MOLbKbDStQef');

  const observer = doc.onSnapshot(docSnapshot => {
  // console.log(`Received doc snapshot: ${docSnapshot}`);
  // ...
  }, err => {
    // console.log(`Encountered error: ${err}`);
  });

  res.json(users);
}


const saveUser = async (req, res, db) => {
    let updatedId = '';
    const newDocRef = db.collection('users').doc();

    let userRef;
    let doc = {exists:false};
    console.log("body printint", req.body)
    if(req.body.id !== 'undefined') {
       userRef = db.collection('users').doc(req.body.id);
       doc = await userRef.get();
    }

    if (!doc.exists) {
      delete req.body.id;
      await newDocRef.set(req.body);
      updatedId = newDocRef.id;
    } else {
      delete req.body.id;
      await userRef.set(req.body, {merge: true});
      updatedId = userRef.id;
    }

    res.json({message: 'success', saved_id: updatedId});
    // res.json('success')
}

const updateUser = async (req, res, db) => {
  const docRef = db.collection('users').doc(req.body.id);

  delete req.body.id;
  await docRef.set(req.body); 
  res.json({message: 'success'});
}

const deleteUser = async (req, res, db) => {
  const userRef = await db.collection('users').doc(req.body.id);
  await userRef.delete();
  res.json({message: 'success', data: userRef.id});
}

const getSingleUser = async (req, res, db) => {
  const userRef = db.collection('users').doc(req.body.id);
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }

  res.json({message: 'success', data: {id:doc.id, ...doc.data()}})
}

module.exports = {
	loadUsers:loadUsers,
	saveUser: saveUser,
	updateUser: updateUser,
	deleteUser: deleteUser,
	getSingleUser: getSingleUser
}