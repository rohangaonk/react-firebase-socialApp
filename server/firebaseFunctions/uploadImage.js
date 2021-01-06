const { admin, db }= require('../firebase/firebaseAdmin')
const uploadImage = (req, res,) => {
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
module.exports = uploadImage;

