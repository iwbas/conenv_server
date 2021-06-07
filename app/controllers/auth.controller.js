const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const ROLES = db.ROLES;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// isTeacherOrAdmin
exports.createUser = (req, res) => {
  console.log("req.body.role", req.body.role);

  var roleId;

  // ПИСАЛ СОННЫЙ

  //Преподаватель может создавать только пользователей
  //|| Админ может не указывать роль, тогда создастся юзер
  if (req.role === "teacher" || req.body.role === undefined)
    roleId = 1;
  else
    roleId = ROLES.indexOf(req.body.role) + 1;

  if (roleId !== 1 && roleId !== 2)
    return res.status(400).send({ message: "Недопустимая роль." })

  return User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, config.saltRounds),
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic ? req.body.patronymic : null,
    groupId: req.body.groupId ? req.body.groupId : null,
    roleId: roleId,
    createdById: req.userId,
  })
    .then((user) => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }

      var isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Неверный пароль!" });
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
