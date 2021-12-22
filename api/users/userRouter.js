const router = require("express").Router();
const express = require("express");
const {
  createUser,
  getUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
  loginController,
} = require("./userController");

const { verifyToken } = require("../../verifyToken");

// router.post("/", verifyToken, createUser);
// router.get("/", verifyToken, getUsersController);
// router.get("/:id", verifyToken, getUserByIdController);
// router.patch("/:id", verifyToken, updateUserByIdController);
// router.delete("/:id", verifyToken, deleteUserByIdController);
// router.post("/login", loginController);

router.get("/:id", verifyToken, getUserByIdController);

module.exports = router;
