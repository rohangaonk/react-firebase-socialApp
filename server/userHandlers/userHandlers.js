const {db, admin} = require('../firebase/firebaseAdmin')


// create user
exports.createUser = (req, res) => {
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

// upload image
exports.uploadImage = (req, res,) => {
   const BusBoy = require('busboy');
   const path = require('path');
   const os = require('os');
   const fs = require('fs');
   const {v4:uuidv4} = require('uuid')
   const imageToken = uuidv4();
  
  

   const busboy = new BusBoy({headers:req.headers});
   let imageFileName;
   let imageToBeUploaded ={};

   busboy.on('file',(fieldname, file, filename, encoding, mimetype) => {

     if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
     const imageExtension = filename.split('.').slice(-1)[0];
    imageFileName = `${Math.round(Math.random()*10000000000)}.${imageExtension}`;
     const filepath = path.join(os.tmpdir(), imageFileName)
    
     console.log(filepath)
     
     imageToBeUploaded = {
         filepath,
         mimetype
     }
     file.pipe(fs.createWriteStream(filepath))

   });
   busboy.on('finish',()=>{
       console.log(imageToBeUploaded.mimetype)
       admin.storage().bucket('social-app-roy.appspot.com').upload(imageToBeUploaded.filepath, {  
        resumable:false,
        metadata: {
            metadata: {
                contentType: imageToBeUploaded.mimetype,
                firebaseStorageDownloadTokens: imageToken
          }
        }
       })
       .then(() => {
            
           const imageUrl = `https://firebasestorage.googleapis.com/v0/b/social-app-roy.appspot.com/o/${imageFileName}?alt=media&token=${imageToken}`
           return db.doc(`/users/${req.user.handle}`).update({imageUrl})
       })
       .then(() => {
          
           res.json({message:'Image uploaded successfully'})
       })
       .catch(err =>{ 
        
        res.status(500).json({error:err})})
   })
     req.pipe(busboy);

};

exports.addUserDetails = ()=>{
    console.log('un')
}