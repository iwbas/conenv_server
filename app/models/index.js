const config = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorAliases: false,

  pool: config.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.group = require("./group.model")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.task = require("./task.model.js")(sequelize, Sequelize);
db.topic = require("./topic.model.js")(sequelize, Sequelize);
db.contest = require("./contest.model.js")(sequelize, Sequelize);
db.answer = require("./answer.model.js")(sequelize, Sequelize);
db.contest_task = require("./contest_task.model")(sequelize, Sequelize);

// User have one creator
db.user.hasOne(db.user, {
  as: "creator",
  foreignKey: "creatorId",
  // cuz of admin
  // foreignKey: { allowNull: false },
  // db.user.belongsTo(db.user, {
});

// user *--1 group
db.group.hasMany(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.user.belongsTo(db.group, { as: "group" });

// user *--1 role
db.role.hasMany(db.user, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
db.user.belongsTo(db.role, { as: "role", foreignKey: { allowNull: false } });

// db.ROLES = ['user', 'admin', 'moderator'];
db.ROLES = ["user", "teacher", "admin"];

// task *--1 topic
db.topic.hasMany(db.task, { onDelete: "CASCADE", onUpdate: "CASCADE" });
db.task.belongsTo(db.topic);

// task *--* contest
db.task.belongsToMany(db.contest, {
  through: db.contest_task,
  as: "contests",
  foreignKey: "task_id",
});
db.contest.belongsToMany(db.task, {
  through: db.contest_task,
  as: "tasks",
  foreignKey: "contest_id",
});

// user *--* contest
db.user.belongsToMany(db.contest, {
  through: "contest_user",
  as: "contests",
  foreignKey: "user_id",
});
db.contest.belongsToMany(db.user, {
  through: "contest_user",
  as: "users",
  foreignKey: "contest_id",
});

db.answer.belongsTo(db.user, {
  as: "author",
  foreignKey: { allowNull: false },
});
db.answer.belongsTo(db.contest_task);

module.exports = db;
