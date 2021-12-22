const {
  create,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserDataById,
  getCollege,
} = require("./userModel");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign, JsonWebTokenError } = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    const body = req.body;

    const salt = genSaltSync(10);
    body.password = await hashSync(body.password, salt);

    await create(body, (err, result) => {
      if (err) {
        console.log(err);
        if (err.errno == 1062) {
          return res.status(500).json({
            success: 0,
            message: "User already registered!",
          });
        }
        return res.status(500).json({
          success: 0,
          message: "Database Connection Error!",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  getUserByIdController: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, result) => {
      if (err) {
        return res.status(500).json("Something went wrong!");
      }
      if (!result) {
        return res.json({ success: 1, message: "User not fount!" }).status(404);
      }
      return res.json({ success: 1, data: result }).status(200);
    });
  },
  getUsersController: (req, res) => {
    getUsers((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json("Something went wrong!");
      }
      return res.json({ success: 1, data: result }).status(200);
    });
  },
  updateUserByIdController: (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    body.id = id;
    console.log(body);
    updateUserById(body, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Connection Error!",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Data Updated Succesfully.",
      });
    });
  },
  deleteUserByIdController: async (req, res) => {
    const id = req.body.id;
    console.log("ID : ", id);
    await deleteUserById(id, (err, result) => {
      if (err) {
        return res.status(500).json("Something went wrong!");
      }
      console.log(result);
      if (result.affectedRows == 0) {
        return res.json({ success: 1, message: "User not fount!" }).status(404);
      }
      return res.json("Deleted").status(200);
    });
  },
  loginController: (req, res) => {
    const body = req.body;
    console.log(req.user);
    console.log(body);

    getUserDataById(body.id, (err, result) => {
      if (err) {
        return res.status(500).json("Something went wrong!");
      }
      if (!result) {
        return res.json({ success: 0, message: "Invalid ID" }).status(404);
      }
      const data = compareSync(body.password, result.password);
      result.password = null;
      if (data) {
        data.password = undefined;
        const token = sign({ data: result }, process.env.TOKEN_KEY, {
          expiresIn: "2h",
        });
        return res
          .json({
            success: 1,
            message: "Login successfully.",
            token: token,
            result,
          })
          .status(200);
      } else {
        return res.json({ success: 0, message: "Wrong Password!" }).status(500);
      }
    });
  },
};
