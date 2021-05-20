const db = require('../models');
const User = db.user;
const Role = db.role;
const Group = db.group;

exports.getAllUsers = (req, res) => {
  // user,role,group
  User.findAll({
    attributes: {
      exclude: ['password', 'groupId', 'roleId', 'createdById' ],
    },
    include: [
      // 'createdBy',
      {
        model: User,
        as: "createdBy",
        attributes: ['id', 'username']
      },
      {
        model: Role,
        as: "role",
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: Group,
        as: "group",
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  }).then(users => {
    res.send({ users: users })
  }).catch(err => {
    console.log(err);
    res.status(500).send({ message: err })
  });
}

exports.getMyUsers = (req, res) => {
  console.log(req.userId)
  User.findAll({
    where: {
      groupId: req.userId
    }
  }).then(users => res.send({ users: users }));
};
