const { verify } = require("jsonwebtoken");
const {
  getUserDataById,
  getUserById,
  getCollege,
  getDepartment,
} = require("./api/users/userModel");

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
      verify(token, process.env.TOKEN_KEY, (err, decodedToken) => {
        if (err) {
          res.redirect("/login");
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect("/login");
    }
  },

  checkUser: (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
      verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
          console.log("ERROR : ", err);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user;
          await getUserDataById(decodedToken.id, (error, result) => {
            if (error) {
              console.log(error);
              next();
            } else {
              res.locals.user = result;
              next();
            }
          });
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  },
};
