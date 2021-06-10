module.exports = (sequielize, Sequelize) => {
  const Group = sequielize.define('groups', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
  });

  return Group;
};