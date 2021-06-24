module.exports = (sequelize, Sequelize, User) => {
  const Group = sequelize.define("groups", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: "uniqueOwnerName",
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      unique: "uniqueOwnerName",
    },
  });

  return Group;
};
