const controller = require("../controllers/contest.controller");
const { authJWT } = require("../middleware/index");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/contests",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.createContest
  );

  app.get(
    "/api/contests/",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getAllContests
  );

  app.get(
    "/api/contests/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getContest
  );

  app.put(
    "/api/contests/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.updateContest
  );

  app.delete(
    "/api/contests/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.deleteContest
  );
};
