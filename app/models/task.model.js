module.exports = (sequelize, Sequelize, User) => {
  const Task = sequelize.define('tasks', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: "uniqueTaskOwnerName",
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    answer: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      unique: "uniqueTaskOwnerName",
    },
  });

  return Task;
};
