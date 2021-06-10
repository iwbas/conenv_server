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

db.user.belongsTo(db.user, {
  as: "createdBy",
  foreignKey: { allowNull: false },
});
db.user.belongsTo(db.role, { as: "role", foreignKey: { allowNull: false } });
db.user.belongsTo(db.group, { as: "group" });

// db.ROLES = ['user', 'admin', 'moderator'];
db.ROLES = ["user", "teacher", "admin"];

db.task.belongsTo(db.topic);

module.exports = db;
