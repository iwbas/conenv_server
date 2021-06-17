const db = require("../models");
const Group = db.group;

const getPagination = require("../common/getPagination");

exports.createGroup = (req, res) => {
  return Group.create({
    name: req.body.name,
    ownerId: req.userId,
  })
    .then((group) => {
      // res.send({ message: "Group was created successfully!" });
      res.send(group);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllGroups = (req, res) => {
  console.log("getAllGroups");
  console.log(req.query);
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Group.findAndCountAll({
    limit,
    offset,
    order: order,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader(
        "Content-Range",
        `groups ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getGroup = (req, res) => {
  Group.findByPk(req.params.id)
    .then((group) => {
      res.status(200).send(group);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateGroup = (req, res) => {
  console.log(req.body)
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.ownerId = req.userId;

  Group.update(req.body, {
    where: condition,
    returning: true,
  })
    .then((result) => {
      if (result[0] === 0)
        res.status(403).send({ message: "Вы не владелец группы" });
      res.status(200).send(result[1][0]);
    })
    .catch((err) => {
      res.status(400).send({ message: err.original.detail });
    });
};

exports.deleteGroup = (req, res) => {
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.ownerId = req.userId;

  Group.destroy({
    where: condition,
  })
    .then((result) => {
      if (!result)
        res.status(403).send({ message: "Вы не владелец группы" });
      res.status(200).send({ message: "Group deleted" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
