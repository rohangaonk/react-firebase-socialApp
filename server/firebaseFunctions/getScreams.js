const {db, admin} = require('../firebase/firebaseAdmin');

const getScreams = (req, res) => {
    
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
module.exports = getScreams;