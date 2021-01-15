const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "social-app-roy.appspot.com",
});
const db = admin.firestore();

module.exports = {
  admin,
  db,
};
