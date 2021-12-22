const router = require("express").Router();
const express = require("express");
const { deleteUserByIdController } = require("./userController");

const { verifyToken } = require("../../verifyToken");

router.post(
  "/delete",
  express.urlencoded({ extended: false }),
  verifyToken,
  deleteUserByIdController
);

module.exports = router;
