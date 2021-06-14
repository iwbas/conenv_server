// TODO UNIQUE ONLY FOR OWNER ??

module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("groups", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
  });

  return Group;
};
