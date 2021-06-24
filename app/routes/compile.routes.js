const controller = require('../compiler/compile');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // get the list of notes
  app.post('/api/compile', controller.compile);

  app.post('/api/run', controller.run);
};