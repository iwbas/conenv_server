module.exports = (sequielize, Sequelize) => {
  const Task = sequielize.define('tasks', {
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
