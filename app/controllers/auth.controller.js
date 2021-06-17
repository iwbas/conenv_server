const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const ROLES = db.ROLES;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// isTeacherOrAdmin
exports.createUser = (req, res) => {
  var roleId;

  // Если пользователя создает админ, то он может указать роль.
  if (req.role === "admin") roleId = req.body.roleId;
  // Иначе пользователя создает преподаватель. Преподаватель может создавать только user.
  else
    roleId = 1;

  if (roleId !== 1 && roleId !== 2)
    return res.status(400).send({ message: "Недопустимая роль." });

  return User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, config.saltRounds),
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic ? req.body.patronymic : null, 
    roleId: req.body.roleId,
    creatorId: req.userId,
  })
    .then((user) => {
      user.setGroups(req.body.groups);
      res.send(user);
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

      var httpOnlyToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 часа
      });

      var token = jwt.sign(
        { id: user.id, username: user.username },
        config.secret,
        {
          expiresIn: 86400, // 24 часа
        }
      );

      user.getRole().then((role) => {
        var expiryDate = new Date(Number(new Date()) + 86400);
        // expiresIn: expiryDate,
        res.cookie("httpOnlyToken", httpOnlyToken, { httpOnly: true });
        res.cookie("token", token);

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: role.name,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signout = (req, res) => {
  res.clearCookie("httpOnlyToken");
  res.clearCookie("token");

  res.status(200).send({ message: "signout" });
};
