const controller = require("../controllers/group.controller");
const { authJWT } = require("../middleware/index");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/groups", [authJWT.verifyToken], controller.createGroup);

  app.get(
    "/api/groups/",
    //[authJWT.verifyToken, authJWT.isAdmin],
    controller.getAllGroups
  );

  app.get("/api/groups/:id", controller.getGroup);

  app.put("/api/groups/:id", controller.updateGroup);

  app.delete("/api/groups/:id", controller.deleteGroup);
};
