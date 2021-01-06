const express = require('express');
const router = express.Router();
const {createUser, uploadImage, addUserDetails} = require('../userHandlers/userHandlers')
const {createScream, getScreams} = require('../screanHandlers/screamHandlers')
const checkIfAuthenticated = require('../auth/auth');



router.post('/auth/signup', createUser);
router.post('/api/scream',checkIfAuthenticated, createScream);
router.get('/api/screams',getScreams);
router.post('/user/image', checkIfAuthenticated,uploadImage);
router.post('/user', checkIfAuthenticated, addUserDetails)

module.exports = router;