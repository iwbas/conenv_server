const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

function newUser(req, res, role) {
  return User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, config.saltRounds),
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic ? req.body.patronymic : null,
    groupId: req.body.groupId ? req.body.groupId : null
  })
    .then((user) => {
      user.setRole(role).then((_) => {
        res.send({ message: 'User was registered successfully!' });
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
}

// isTeacherOrAdmin
exports.createUser = (req, res) => {
  newUser(req, res, 1);
};

// isAdmin
exports.createTeacher = (req, res) => {
  newUser(req, res, 2);
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      var isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: 'Неверный пароль!' });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 часа
      });

      user.getRole().then((role) => {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: role.name,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
