module.exports = (sequelize, Sequelize) => {
  const Contest = sequelize.define("contests", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return Contest;
};
