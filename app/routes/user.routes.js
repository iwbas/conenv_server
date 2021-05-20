const { authJWT } = require('../middleware');
const controller = require('../controllers/user.controller');

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
};



/*
app.get('/api/test/all', controller.allAccess);

  app.get('/api/test/user', [authJWT.verifyToken], controller.userBoard);

  app.get(
    '/api/test/teacher',
    [authJWT.verifyToken, authJWT.isTeacher],
    controller.moderatorBoard
  );

  app.get(
    '/api/test/admin',
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.adminBoard
  );

  app.get(
    '/api/users/',
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.getAllUsers
  )

  app.get(
    '/api/myusers',
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getMyUsers
  )

*/
