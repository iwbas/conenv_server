module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define('tasks', {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    answer: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return Task;
};
