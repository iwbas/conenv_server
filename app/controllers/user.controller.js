const db = require("../models");
const User = db.user;
const Role = db.role;
const Group = db.group;
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");

const getPagination = require("../common/getPagination");

exports.getAllUsers = (req, res) => {
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  // user,role,group
  User.findAndCountAll({
    limit,
    offset,
    order: order,
    // where:
    //   req.role === "teacher"
    //     ? {
    //         creatorId: req.userId,
    //       }
    //     : null,
    attributes: {
      exclude: ["password"],
    },
    include: {
      association: "groups",
      as: "groups_ids",
      attributes: ["id"],
      through: { attributes: [] },
    },
  })
    .then((data) => {
      var rows = data.rows;

      var rows = data.rows.map((row) => {
        row.dataValues.groups = row.dataValues.groups.map((r) => r.id);
        return row.dataValues;
      });

      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader(
        "Content-Range",
        `users ${offset}-${offset + limit}/${data.count}`
      );
      res.send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getUser = (req, res) => {
  User.findByPk(req.params.id, {
    attributes: {
      exclude: "password",
    },
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateUser = (req, res) => {
  var condition = {
    id: req.params.id,
  };

  // Если пользователя редактирует преподаватель,
  // то он не может редактировать не своих пользователей
  // и не может менять пароль
  if (req.role === "teacher") {
    delete req.body["password"];
    condition.creatorId = req.userId;
  } else if (req.body.password === null || req.body.password === undefined) {
    delete req.body["password"];
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, config.saltRounds);
  }

  User.findOne({
    where: condition,
  }).then((user) => {
    if (!user && condition.creatorId)
      res.status(403).send({ message: "Нехватает прав" });

    if (req.body.groups) user.setGroups(req.body.groups);
    user
      .update(req.body, {
        returning: true,
      })
      .then((result) => {
        console.log(result);
        res.status(200).send(result.dataValues);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};

exports.deleteUser = (req, res) => {
  console.log("deleteUser");
  if (req.params.id == 1)
    return res.status(400).send({ message: "Нельзя удалить админа" });

  var condition = {
    id: req.params.id,
  };

  if (req.role !== "admin") condition.creatorId = req.userId;

  console.log("AJHSDHASDASD")
  console.log(req.role, condition);

  User.destroy({
    where: condition,
  })
    .then((result) => {
      console.log(result);
      if (!result)
        res.status(403).send({ message: "Не хватает прав" });
      res.status(200).send({ message: result });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
