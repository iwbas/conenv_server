module.exports = (sequelize, Sequelize) => {
    const Contest_User = sequelize.define("contest_user", {
      answer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mark: {
        type: Sequelize.INTEGER,
        validate: {
          twoToFive(value) {
            var candidate = parseInt(value)
            if (candidate < 2 || parseInt(value) > 5) {
              throw new Error("Оценка не может быть меньше 2 и больше 5");
            }
          }
        }
      }
    });
  
    return Contest_User;
  };
  