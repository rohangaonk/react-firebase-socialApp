const {db, admin}= require('../firebase/firebaseAdmin');

const createScream = (req, res) => {

    const newScream = {
        userHandle:req.user.handle,
        body:req.body.body,
        createdAt:new Date().toISOString()

    }
   db.collection('scream').add(newScream)
   .then(doc =>{
       res.json({message:`document ${doc.id} created`})
   })
   .catch(err =>{
      res.status(500).json({error:"something went wrong"})
      console.log(err)
   })

}

module.exports = createScream;