module.exports = (sequelize, Sequelize) => {
    const Contest = sequelize.define("contest_task", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      }
    });
  
    return Contest;
  };
  