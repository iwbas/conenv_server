const db   = require('../models');
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.');
};

exports.userBoard = (req, res) => {
  res.status(200).send('User Content.');
};

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send('Moderator Content.');
};

exports.getAllUsers = (req, res) => {
  User.findAll().then(users => {
    res.send({ users: users })
  });
}

exports.getMyUsers = (req, res) => {
  console.log(req.userId)
  User.findAll({
    where: {
      groupId: req.userId
    }
  }).then(users => res.send({users: users}));
};
