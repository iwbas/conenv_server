const config = require('../config/db.config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorAliases: false,

  pool: config.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.group = require('./group.model')(sequelize, Sequelize, db.user);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.task = require('./task.model.js')(sequelize, Sequelize);
db.topic = require('./topic.model.js')(sequelize, Sequelize);
db.contest = require('./contest.model.js')(sequelize, Sequelize);
db.contest_user = require('./contest_user.model')(sequelize, Sequelize);

// User have one creator --- DONE
db.user.hasOne(db.user, {
  as: 'creator',
  foreignKey: 'creatorId',
});

// user *--* group -- DONE
db.user.belongsToMany(db.group, {
  through: 'user_group',
  as: 'groups',
  foreignKey: 'user_id',
});
db.group.belongsToMany(db.user, {
  through: 'user_group',
  as: 'users',
  foreignKey: 'group_id',
});

// user creator
// user 1--* group
db.user.hasMany(db.group, {
  as: 'owner',
  foreignKey: 'ownerId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.group.belongsTo(db.user, { as: 'owner', foreignKey: 'ownerId' });

// user *--1 role -- DONE
db.role.hasMany(db.user, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
});
db.user.belongsTo(db.role, { as: 'role', foreignKey: { allowNull: false } });

// db.ROLES = ['user', 'admin', 'moderator'];
db.ROLES = ['user', 'teacher', 'admin'];

// task *--1 topic -- DONE
db.topic.hasMany(db.task, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.task.belongsTo(db.topic);

// topic creator
db.user.hasMany(db.topic, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.topic.belongsTo(db.user);

// task creator
db.user.hasMany(db.task, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.task.belongsTo(db.user);

// contest creator
// db.user.hasMany(db.topic, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// db.topic.belongsTo(db.user);

// contest *--1 task -- DONE
db.task.hasMany(db.contest, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: {
    allowNull: false,
  },
});
db.contest.belongsTo(db.task);

// user *--* contest -- DONE
db.user.belongsToMany(db.contest, {
  through: db.contest_user,
  as: 'contests',
  foreignKey: 'user_id',
});
db.contest.belongsToMany(db.user, {
  through: db.contest_user,
  as: 'users',
  foreignKey: 'contest_id',
});

module.exports = db;
