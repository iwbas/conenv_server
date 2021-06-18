const controller = require("../controllers/topic.controller");
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
    "/api/topics",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.createTopic
  );

  app.get(
    "/api/topics/",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getAllTopics
  );

  app.get(
    "/api/topics/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getTopic
  );

  app.put(
    "/api/topics/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.updateTopic
  );

  app.delete(
    "/api/topics/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.deleteTopic
  );
};
