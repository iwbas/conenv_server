const db = require("../models");
const User = db.user;
const Role = db.role;
const Group = db.group;

const getPagination = require("../common/getPagination");

exports.getAllUsers = (req, res) => {
  console.log("getAllUsers")
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  // user,role,group
  User.findAndCountAll({
    limit,
    offset,
    order: order,
    where:
      req.role === "teacher"
        ? {
            createdById: req.userId,
          }
        : null,
    attributes: {
      exclude: ['password', 'groupId', 'roleId', 'createdById'],
    },
    // include: [
    //   {
    //     model: User,
    //     as: "createdBy",
    //     attributes: ["id", "username"],
    //   },
    //   {
    //     model: Role,
    //     as: "role",
    //     attributes: {
    //       exclude: ["createdAt", "updatedAt"],
    //     },
    //   },
    //   {
    //     model: Group,
    //     as: "group",
    //     attributes: {
    //       exclude: ["createdAt", "updatedAt"],
    //     },
    //   },
    // ],
  })
    .then((data) => {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader(
        "Content-Range",
        `users ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getUser = (req, res) => {
  User.findByPk(req.params.id, {
    attributes: {
      // exclude: ['password', 'groupId', 'roleId', 'createdById'],
      exclude: "password",
    },
    include: [
      {
        model: User,
        as: "createdBy",
        attributes: ["id", "username"],
      },
      {
        model: Role,
        as: "role",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Group,
        as: "group",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateUser = (req, res) => {
  var body =
    req.params.id == 1
      ? {
          password: req.body.password,
          email: req.body.email,
        }
      : req.body;

  User.update(body, {
    where: { id: req.params.id },
    returning: true,
  })
    .then((result) => {
      res.status(200).send(result[1][0]);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.deleteUser = (req, res) => {
  console.log("DELETE", req.params.id);
  if (req.params.id == 1)
    return res.status(400).send({ message: "No permissions" });

  var condition = {
    id: req.params.id,
  }

  if (req.role === "teacher")
    condition.createdById = req.userId;

  console.log(req.role, condition)

  User.destroy({
    where: condition,
  })
    .then((result) => {
      res.status(200).send({ message: result });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
