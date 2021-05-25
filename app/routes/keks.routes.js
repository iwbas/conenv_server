const { verifySignUp, authJWT } = require('../middleware');
const controller = require('../controllers/auth.controller');

const crud = require('express-sequelize-crud')
const {sequelizeCrud} = crud;
const db = require('../models');
const User = db.user;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // app.use(crud.crud('/api/test', sequelizeCrud(User)))
};
