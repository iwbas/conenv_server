const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var saltRounds = 8;

exports.signup = (req, res) => {
  // Сохраняем юзера
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then((_) => {
            res.send({ message: 'User was registered successfully!' });
          });
        });
      } else {
        // роль не указана, значит обычный юзер
        user.setRoles([1]).then((_) => {
          res.send({ message: 'User was registered successfully!' });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      var isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: 'Invalid password!' });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 часа
      });

      var authorities = [];

      user.getRoles().then((roles) => {
        for (let role of roles) {
          authorities.push('ROLE_' + role.name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
