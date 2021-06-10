const { authJWT, verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/users",
    // [
    //   authJWT.verifyToken,
    //   authJWT.isTeacherOrAdmin,
    //   verifySignUp.checkDuplicateUsernameOrEmail,
    // ],
    authController.createUser
  );

  // get the list of notes
  app.get(
    "/api/users/",
    //[authJWT.verifyToken, authJWT.isTeacherOrAdmin],
    controller.getAllUsers
  );

  // get a single note
  app.get("/api/users/:id", controller.getUser);

  // update a note
  app.put("/api/users/:id", controller.updateUser);

  // delete a note
  app.delete(
    "/api/users/:id",
    // [
    //   authJWT.verifyToken,
    //   authJWT.isTeacherOrAdmin,
    // ],
    controller.deleteUser
  );
};
