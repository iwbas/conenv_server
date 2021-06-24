const db = require('../models');
const Contest = db.contest;
const Group = db.group;

const getPagination = require('../common/getPagination');

exports.createContest = (req, res) => {
  return Contest.create({
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
    taskId: req.body.taskId,
    groupId: req.body.groupId,
  })
    .then((contest) => {
      Group.findByPk(req.body.groupId).then((group) =>
        group.getUsers().then((res) => {
          contest.setUsers(res);
        })
      );
      res.send(contest);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllContests = (req, res) => {
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Contest.findAndCountAll({
    limit,
    offset,
    order: order,
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  })
    .then((data) => {
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      res.setHeader(
        'Content-Range',
        `contests ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getContest = (req, res) => {
  console.log('get contest');
  Contest.findByPk(req.params.id)
    .then((contest) => {
      res.status(200).send(contest);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.updateContest = (req, res) => {
  console.log(req.body);
  var condition = {
    id: req.params.id,
  };

  if (req.role !== 'admin') condition.userId = req.userId;

  Contest.update(req.body, {
    where: condition,
    returning: true,
  })
    .then((result) => {
      if (result[0] === 0)
        res.status(403).send({ message: 'Вы не владелец задания' });
      res.status(200).send(result[1][0]);
    })
    .catch((err) => {
      res.status(400).send({ message: err.original.detail });
    });
};

exports.deleteContest = (req, res) => {
  var condition = {
    id: req.params.id,
  };

  if (req.role !== 'admin') condition.userId = req.userId;

  Contest.destroy({
    where: condition,
  })
    .then((result) => {
      if (!result) res.status(403).send({ message: 'Вы не владелец задания' });
      res.status(200).send({ message: 'Contest deleted' });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
