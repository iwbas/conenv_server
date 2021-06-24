const db = require("../models");
const Task = db.task;

const getPagination = require("../common/getPagination");

exports.createTask = (req, res) => {
  return Task.create({
    content: req.body.content,
    answer: req.body.answer,
    topicId: req.body.topicId,
    userId: req.userId,
  })
    .then((task) => {
      res.send(task);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllTasks = (req, res) => {
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Task.findAndCountAll({
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
        `tasks ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getTask = (req, res) => {
  Task.findByPk(req.params.id)
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateTask = (req, res) => {
  console.log(req.body)
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.userId = req.userId;

  Task.update(req.body, {
    where: condition,
    returning: true,
  })
    .then((result) => {
      if (result[0] === 0)
        res.status(403).send({ message: "Вы не владелец задания" });
      res.status(200).send(result[1][0]);
    })
    .catch((err) => {
      res.status(400).send({ message: err.original.detail });
    });
};

exports.deleteTask = (req, res) => {
  var condition = {
    id: req.params.id,
  }

  if (req.role !== "admin") condition.userId = req.userId;

  Task.destroy({
    where: condition,
  })
    .then((result) => {
      if (!result)
        res.status(403).send({ message: "Вы не владелец задания" });
      res.status(200).send({ message: "Task deleted" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
