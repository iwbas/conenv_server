module.exports = (sequielize, Sequelize) => {
    const User = sequielize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    })

    return User;
}