module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("answers", {
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  
    return Answer;
  };
  