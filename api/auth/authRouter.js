const express = require("express");
const router = express.Router();
const {
  register_post,
  login_post,
  login_get,
  register_get,
  logout_all,
} = require("../users/authController");

const { verifyToken } = require("../../verifyToken");

router.get("/register", register_get);
router.post(
  "/register",
  express.urlencoded({ extended: false }),
  register_post
);

router.get("/login", login_get);
router.post("/login", express.urlencoded({ extended: false }), login_post);

router.all("/logout", logout_all);

module.exports = router;
