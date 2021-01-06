const express = require('express');
const router = express.Router();
const {createUser, uploadImage, addUserDetails} = require('../userHandlers/userHandlers')


const checkIfAuthenticated = require('../auth/auth');
const createScream = require('../firebaseFunctions/createScream');
const getScreams = require('../firebaseFunctions/getScreams');


router.post('/auth/signup', createUser);
router.post('/api/scream',checkIfAuthenticated, createScream);
router.get('/api/screams',getScreams);
router.post('/user/image', checkIfAuthenticated,uploadImage);
router.post('/user', addUserDetails)

module.exports = router;