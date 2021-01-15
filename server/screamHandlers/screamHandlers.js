const { db, admin } = require("../firebase/firebaseAdmin");

// ******************************************************************************
exports.getScreams = (req, res) => {
  db.collection("scream")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      const screams = [];
      data.forEach((doc) => {
        screams.push({ ...doc.data(), screamId: doc.id });
      });
      res.send(screams);
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "error when retrieving screams" });
    });
};

// ******************************************************************************
exports.createScream = (req, res) => {
  const newScream = {
    userHandle: req.user.handle,
    body: req.body.body,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("scream")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      console.log(err);
    });
};

// ******************************************************************************
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/scream/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("scream not found");
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

// ******************************************************************************
exports.commentOnScream = (req, res) => {
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.userHandle,
    userImage: req.user.imageUrl,
  };
  db.doc(`/scream/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("scream not found");
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json({ newComment });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ******************************************************************************
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/scream/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else throw new Error("scream not found");
    })
    .then((data) => {
      if (data.empty)
        return db.collection("likes").add({
          screamId: req.params.screamId,
          userHandle: req.user.handle,
        });
      else throw new Error("scream already liked");
    })
    .then(() => {
      screamData.likeCount++;
      return screamDocument.update({ likeCount: screamData.likeCount });
    })
    .then(() => {
      return res.json(screamData);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ******************************************************************************
exports.unLikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/scream/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else throw new Error("scream not found");
    })
    .then((data) => {
      if (data.empty) throw new Error("scream not liked");
      else {
        return db.doc(`/likes/${data.docs[0].id}`).delete();
      }
    })
    .then(() => {
      screamData.likeCount--;
      return screamDocument.update({ likeCount: screamData.likeCount });
    })
    .then(() => {
      return res.json(screamData);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ******************************************************************************
exports.deleteScream = (req, res) => {
  const likesToDelete = db.batch();
  const commentsToDelete = db.batch();
  const screamId = req.params.screamId;
  const screamDoc = db.doc(`/scream/${screamId}`);

  screamDoc
    .get()
    .then((doc) => {
      if (!doc.exists) throw new Error("scream does not exist");
      if (doc.data().userHandle !== req.user.handle)
        throw new Error("This is not your scream");
      return screamDoc.delete();
    })
    .then(() => {
      return db.collection("likes").where("screamId", "==", screamId).get();
    })
    .then((docs) => {
      docs.forEach((doc) => {
        likesToDelete.delete(doc.ref);
      });
      return likesToDelete.commit();
    })
    .then(() => {
      return db.collection("comments").where("screamId", "==", screamId).get();
    })
    .then((docs) => {
      docs.forEach((doc) => {
        commentsToDelete.delete(doc.ref);
      });
      return commentsToDelete.commit();
    })
    .then(() => res.json({ message: "scream deleted" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
