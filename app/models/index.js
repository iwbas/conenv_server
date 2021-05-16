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

db.user  = require('./user.model.js')(sequelize, Sequelize);
db.role  = require('./role.model.js')(sequelize, Sequelize);
db.task  = require('./task.model.js')(sequelize, Sequelize);
db.topic = require('./topic.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
});

db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
});

db.user.belongsTo(db.user, {as: "created_by"})

db.ROLES = ['user', 'admin', 'moderator'];


db.task.belongsTo(db.topic)

// git commit -m "task and topic models implemented"

module.exports = db;
