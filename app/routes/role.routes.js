const { authJWT } = require('../middleware');
const controller = require('../controllers/user.controller');

const db = require('../models');
const Role = db.role;
const crud = require('express-sequelize-crud');
const { sequelizeCrud } = crud;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/users/getAllUsers',
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.getAllUsers
  );

  console.log(crud)
  app.use(//[authJWT.verifyToken, authJWT.isAdmin], 
    crud.crud('/api/roles', sequelizeCrud(Role)))
};
