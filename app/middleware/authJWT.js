const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    console.log('decoded', decoded);
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }

    req.userId = decoded.id;
    next();
  });
}

function isAdmin(req, res, next) {
  User.findByPk(req.userId).then((user) => {

    if (!user) return res.status(401).send({message: 'Unauthorized!'})

    user.getRole().then((role) => {
      if (role.name == 'admin') {
        next();
        return;
      }

      res.status(403).send({
        message: 'Require Admin role!',
      });
      return;
    });
  });
}

function isTeacher(req, res, next) {
  User.findByPk(req.userId).then((user) => {

    if (!user) return res.status(401).send({message: 'Unauthorized!'})

    user.getRole().then((role) => {
      if (role.name === 'teacher') {
        next();
        return;
      }

      res.status(403).send({
        message: 'Require Teacher Role!',
      });
    });
  });
}

function isTeacherOrAdmin(req, res, next) {
  User.findByPk(req.userId).then((user) => {

    if (!user) return res.status(401).send({message: 'Unauthorized!'})

    user.getRole().then((role) => {
      if (role.name === 'teacher' || role.name === 'admin') {
        req.role = role.name
        next();
        return;
      }

      res.status(403).send({
        message: 'Require Teacher or Admin role!',
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
