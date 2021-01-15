const express = require("express");
const router = express.Router();
const {
  createUser,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
} = require("../userHandlers/userHandlers");
const {
  createScream,
  getScreams,
  getScream,
  commentOnScream,
  likeScream,
  unLikeScream,
  deleteScream,
} = require("../screamHandlers/screamHandlers");
const checkIfAuthenticated = require("../auth/auth");

router.post("/api/scream", checkIfAuthenticated, createScream);
router.get("/api/screams", getScreams);
router.get("/api/scream/:screamId", getScream);
router.post(
  "/api/scream/:screamId/comment",
  checkIfAuthenticated,
  commentOnScream
);
router.get("/api/scream/:screamId/like", checkIfAuthenticated, likeScream);
router.get("/api/scream/:screamId/unlike", checkIfAuthenticated, unLikeScream);
router.get("/api/scream/:screamId/delete", checkIfAuthenticated, deleteScream);

router.post("/auth/signup", createUser);
router.post("/user/image", checkIfAuthenticated, uploadImage);
router.post("/user", checkIfAuthenticated, addUserDetails);
router.get("/user", checkIfAuthenticated, getAuthenticatedUser);
router.get("/user/:handle", getUserDetails);

module.exports = router;
