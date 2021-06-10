module.exports = (sequielize, Sequelize) => {
  const Contest = sequielize.define("contests", {
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
