const { db, admin } = require("../firebase/firebaseAdmin");

// ******************************************************************************
exports.createUser = (req, res) => {
  const { email, password, handle } = req.body;

  db.doc(`/users/${handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        throw new Error("user handle already exists");
      } else {
        console.log(email);
        return admin.auth().createUser({
          email,
          password,
          handle,
        });
      }
    })
    .then((user) => {
      const userCredentials = {
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/social-app-roy.appspot.com/o/defaultImage.png?alt=media&token=4acb0631-14ce-44a9-93fc-331e67860f02",
        handle,
        email,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };
      return db.collection("users").doc(handle).set(userCredentials);
    })
    .then(() => res.status(201).json({ message: "user created" }))
    .catch((err) => {
      const message = err.message || err.code;
      console.log(message);
      res.status(400).json({ message });
    });
};

// ******************************************************************************
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const { v4: uuidv4 } = require("uuid");
  const imageToken = uuidv4();

  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".").slice(-1)[0];
    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);

    console.log(filepath);

    imageToBeUploaded = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    console.log(imageToBeUploaded.mimetype);
    admin
      .storage()
      .bucket("social-app-roy.appspot.com")
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            firebaseStorageDownloadTokens: imageToken,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/social-app-roy.appspot.com/o/${imageFileName}?alt=media&token=${imageToken}`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        res.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
  req.pipe(busboy);
};

// ******************************************************************************
exports.addUserDetails = (req, res) => {
  const { bio, website, location } = req.body;
  console.log(req.body);
  db.doc(`/users/${req.user.handle}`)
    .update({
      bio,
      website,
      location,
    })
    .then(() => res.json({ message: "details added" }))
    .catch((err) => res.status(500).json({ error: err.code }));
};

// ******************************************************************************
// authenticated user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();

        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });

      return res.json({ ...userData });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

// ******************************************************************************
// any user details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("scream")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      }
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        userData.screams.push({ ...doc.data(), screamId: doc.id });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
