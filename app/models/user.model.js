module.exports = (sequielize, Sequelize) => {
  const User = sequielize.define('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    surname: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    patronymic: {
      type: Sequelize.STRING(25),
    },
  });

  return User;
};
