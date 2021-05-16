module.exports = (sequielize, Sequelize) => {
  const Topic = sequielize.define('topics', {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  });

  return Topic;
};
