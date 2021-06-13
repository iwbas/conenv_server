const db = require("../models");
const Role = db.role;

const getPagination = require("../common/getPagination");

exports.getAllRoles = (req, res) => {
  console.log("getAllRoles")
  console.log(req.query)
  const order = req.query.sort ? [JSON.parse(req.query.sort)] : [];
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Role.findAndCountAll({
    limit,
    offset,
    order: order,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader(
        "Content-Range",
        `roles ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};
