const express = require("express");
const router = express.Router();
const {
  createUser,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
} = require("../userHandlers/userHandlers");

const checkIfAuthenticated = require("../auth/auth");

router.post("/auth/signup", createUser);
router.post("/image", checkIfAuthenticated, uploadImage);
router.post("/", checkIfAuthenticated, addUserDetails);
router.get("/", checkIfAuthenticated, getAuthenticatedUser);
router.get("/:handle", getUserDetails);

module.exports = router;
