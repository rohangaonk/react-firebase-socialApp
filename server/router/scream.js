const express = require("express");
const router = express.Router();

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

router.post("/scream", checkIfAuthenticated, createScream);
router.get("/screams", getScreams);
router.get("/scream/:screamId", getScream);
router.post("/scream/:screamId/comment", checkIfAuthenticated, commentOnScream);
router.get("/scream/:screamId/like", checkIfAuthenticated, likeScream);
router.get("/scream/:screamId/unlike", checkIfAuthenticated, unLikeScream);
router.get("/scream/:screamId/delete", checkIfAuthenticated, deleteScream);

module.exports = router;
