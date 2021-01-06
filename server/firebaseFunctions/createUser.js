const {db, admin} = require('../firebase/firebaseAdmin')
const createUser = (req, res) => {
const {
      email,
      phoneNumber,
      password,
      handle,
    } = req.body;

  
  
    // create user in database only if handle is unique
    db.doc(`/users/${handle}`).get()
    .then(doc => {
      if(doc.exists){
        throw new Error('user handle already exists');
      }
      else{
        return admin.auth().createUser({
            email,
            phoneNumber,
            password,
            handle
        })
      }
    })
    // // store created user in firestore
    .then((user) => {
      const userCredentials = {
         imageUrl:'https://firebasestorage.googleapis.com/v0/b/social-app-roy.appspot.com/o/defaultImage.png?alt=media&token=4acb0631-14ce-44a9-93fc-331e67860f02',
         handle,
         email,
         createdAt:new Date().toISOString(),
         userId:user.uid
      }
      return db.collection('users').doc(handle).set(userCredentials)
    })
    .then(() => res.status(201).json({message:"user created"}))
    .catch((err )=> res.status(400).json({message:err.message})
    )
}

module.exports = createUser