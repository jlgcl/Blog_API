const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const Post = require("../models/post");
const { v4: uuidv4 } = require("../node_modules/uuid");
const User = require("../models/user");

router.post("/posts", [
  body("title").trim().isLength({ min: 0 }),
  body("message").trim().isLength({ min: 0 }),
  body("date").optional({ checkFalsey: true }).isISO8601(),

  sanitizeBody("title").escape(),
  sanitizeBody("message").escape(),
  sanitizeBody("date").toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var post = new Post({
      id: uuidv4(),
      author: "test", //replace with req.user.username - the user MUST be logged in the session.
      title: req.body.title,
      message: req.body.message,
      date: new Date(),
    });

    if (!errors.isEmpty()) {
      res.send("INPUT ERROR");
      return;
    }

    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
]);

/// NOT GOING TO BE USED ///
// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (typeof bearerHeader !== "undefined") {
//     const bearer = bearerHeader.split(" ");
//     const bearerToken = bearer[1];
//     req.token = bearerToken;
//     next();
//   } else {
//     res.sendStatus(404);
//   }
// }

module.exports = router;
