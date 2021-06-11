module.exports = (sequelize, Sequelize) => {
  const Topic = sequelize.define('topics', {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  });

  return Topic;
};
