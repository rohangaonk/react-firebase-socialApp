const { admin, db }= require('../firebase/firebaseAdmin')


const checkIfAuthenticated = (req, res, next) => {
  let idToken;
   if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    idToken = req.headers.authorization.split(' ')[1];
  } else {
    return res.send.status(403).json({error:'Unauthorized'})
  }
  admin.auth().verifyIdToken(idToken)
  .then(decodedToken =>{ 
   req.user = decodedToken;
   return db.collection('users')
   .where('userId', '==', req.user.uid)
   .limit(1)
   .get()
  })
  .then(data => {
    req.user.handle = data.docs[0].data().handle;
    req.user.imageUrl = data.docs[0].data().imageUrl;
    return next()
  })
  .catch(err =>  res.status(401).json({err:err.message})
    )

}

module.exports = checkIfAuthenticated