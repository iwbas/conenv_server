const controller = require('../controllers/role.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // get the list of notes
  app.get('/api/roles/',
    //[authJWT.verifyToken, authJWT.isAdmin],
    controller.getAllRoles
  );
};