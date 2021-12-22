// === Dependences ===

const express = require("express");

// === Config ===
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(express.static(path.join(__dirname, "/static")));
app.use(express.static(path.join(__dirname, "/images")));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 6000 },
    saveUninitialized: false,
    resave: false,
  })
);
app.use(flash());
app.use(cookieParser());
// === Connect to Database ===
// require("./db");
app.set("view engine", "ejs");
app.set("views", "./views");
// === Routes ===
const userRouter = require("./api/users/userRouter");
const authRouter = require("./api/auth/authRouter");
const testRouter = require("./api/users/userRouter");
const deleteRouter = require("./api/users/deleteRouter");
const { verifyToken, checkUser } = require("./verifyToken");
app.get("*", checkUser);
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/api/users", userRouter);
app.use("/", authRouter);
app.use("/", deleteRouter);
app.use("/api/users", testRouter);
app.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard");
});

app.get("/admin", verifyToken, (req, res) => {
  if (res.locals.user.is_admin) {
    res.render("admin");
  } else {
    res.redirect("/");
  }
});
// === App ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
