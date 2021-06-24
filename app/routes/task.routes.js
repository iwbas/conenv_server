const controller = require("../controllers/task.controller");
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
    "/api/tasks",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.createTask
  );

  app.get(
    "/api/tasks/",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getAllTasks
  );

  app.get(
    "/api/tasks/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getTask
  );

  app.put(
    "/api/tasks/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.updateTask
  );

  app.delete(
    "/api/tasks/:id",
    [authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.deleteTask
  );
};
