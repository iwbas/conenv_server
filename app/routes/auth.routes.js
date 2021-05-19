const { verifySignUp, authJWT } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/createUser',
    [
      authJWT.verifyToken,
      authJWT.isTeacherOrAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.createUser
  );

  app.post(
    '/api/auth/createTeacher',
    [
      authJWT.verifyToken,
      authJWT.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.createTeacher
  )

  app.post("/api/auth/signin", controller.signin)
};
