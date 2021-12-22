const {
  create,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserDataById,
  getCollege,
  getDepartment,
} = require("./userModel");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign, JsonWebTokenError } = require("jsonwebtoken");

const createToken = (id) => {
  return sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports = {
  register_post: async (req, res) => {
    const body = req.body;
    if (
      body.name == "" ||
      body.age == "" ||
      body.id == "" ||
      body.password == "" ||
      body.address == "" ||
      body.gpa == ""
    ) {
      return res
        .json({ success: 0, message: "Make sure you fill all the fields." })
        .status(500);
    }
    body.is_admin = 0;

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
      const token = createToken(body.id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: 1,
        data: body,
      });
    });
  },
  register_get: (req, res) => {
    res.render("register");
  },
  login_get: (req, res) => {
    res.render("login");
  },
  login_post: (req, res) => {
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
        // data.password = undefined;
        // const token = sign({ data: result }, process.env.TOKEN_KEY, {
        //   expiresIn: "2h",
        // });
        const token = createToken(body.id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        return res
          .json({
            success: 1,
            token: token,
            result,
          })
          .status(200);
      } else {
        return res.json({ success: 0, message: "Wrong Password!" }).status(500);
      }
    });
  },
  logout_all: (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/dashboard");
  },
};
