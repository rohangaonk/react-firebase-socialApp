const {db, admin} = require('../firebase/firebaseAdmin');

exports.getScreams = (req, res) => {
    
    db.collection('scream')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        const screams = [];
        data.forEach(doc => {
            screams.push({...doc.data()});
        });
        res.send(screams)
    })
    .catch(err =>{
        res.send({message:'error when retrieving screams'})
    } )
}

exports.createScream = (req, res) => {

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
