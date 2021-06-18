const db = require("../models");
const Topic = db.topic;

const getPagination = require("../common/getPagination");

exports.createTopic = (req, res) => {
  return Topic.create({
    name: req.body.name,
    ownerId: req.userId,
  })
    .then((group) => {
      res.send(group);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllTopics = (req, res) => {
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Topic.findAndCountAll({
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
        `topics ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getTopic = (req, res) => {
  Topic.findByPk(req.params.id)
    .then((group) => {
      res.status(200).send(group);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateTopic = (req, res) => {
  console.log(req.body)
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.ownerId = req.userId;

  Topic.update(req.body, {
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

exports.deleteTopic = (req, res) => {
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.ownerId = req.userId;

  Topic.destroy({
    where: condition,
  })
    .then((result) => {
      if (!result)
        res.status(403).send({ message: "Вы не владелец группы" });
      res.status(200).send({ message: "Topic deleted" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
