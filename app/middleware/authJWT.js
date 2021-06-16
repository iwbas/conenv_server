const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

function verifyToken(req, res, next) {
  let httpOnlyToken = req.cookies.httpOnlyToken;
  let token = req.cookies.token;

  if (!httpOnlyToken || !token) {
    // res.cookies.set('httpOnlyToken', {maxAge: 0});
    res.clearCookie("httpOnlyToken");
    res.clearCookie("token");
    return res.status(401).send({
      message: "No token provided!",
    });
  }

  jwt.verify(httpOnlyToken, config.secret, (err, decoded) => {
    console.log("httpOnly", decoded);
    if (err) {
      res.clearCookie("httpOnlyToken");
      res.clearCookie("token");
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;

    jwt.verify(token, config.secret, (err, decoded) => {
      console.log("token", decoded);
      if (err) {
        res.clearCookie("httpOnlyToken");
        res.clearCookie("token");
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }

      next();
    });
  });
}

function isAdmin(req, res, next) {
  User.findByPk(req.userId).then((user) => {
    if (!user) return res.status(401).send({ message: "Unauthorized!" });

    user.getRole().then((role) => {
      if (role.name == "admin") {
        req.role = role.name;
        next();
        return;
      }

      res.status(403).send({
        message: "Require Admin role!",
      });
      return;
    });
  });
}

function isTeacher(req, res, next) {
  User.findByPk(req.userId).then((user) => {
    if (!user) return res.status(401).send({ message: "Unauthorized!" });

    user.getRole().then((role) => {
      if (role.name === "teacher") {
        req.role = role.name;
        next();
        return;
      }

      res.status(403).send({
        message: "Require Teacher Role!",
      });
    });
  });
}

function isTeacherOrAdmin(req, res, next) {
  User.findByPk(req.userId).then((user) => {
    if (!user) return res.status(401).send({ message: "Unauthorized!" });

    user.getRole().then((role) => {
      if (role.name === "teacher" || role.name === "admin") {
        req.role = role.name;
        next();
        return;
      }

      res.status(403).send({
        message: "Require Teacher or Admin role!",
      });
    });
  });
}

const authJWT = {
  verifyToken,
  isAdmin,
  isTeacher,
  isTeacherOrAdmin,
};

module.exports = authJWT;
