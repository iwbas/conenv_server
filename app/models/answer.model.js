module.exports = (sequielize, Sequelize) => {
    const Answer = sequielize.define("answer", {
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  
    return Answer;
  };
  