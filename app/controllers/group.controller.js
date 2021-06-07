const db = require("../models");
const Group = db.group;

const getPagination = require("../common/getPagination");

exports.getAllGroups = (req, res) => {
  console.log("getAllGroups");
  const sort = JSON.parse(req.query.sort);
  const { page, perPage } = req.query;
  const { limit, offset } = getPagination(page, perPage);

  Group.findAndCountAll({
    limit,
    offset,
    order: [sort],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader(
        "Content-Range",
        `users ${offset}-${offset + limit}/${data.count}`
      );
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};
