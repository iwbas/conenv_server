// const db = require("./app/models");
const db = require("./app/models");
const User = db.user;
const Role = db.role;
const Group = db.group;

const bcrypt = require("bcryptjs");
const authConfig = require("./app/config/auth.config");

// dev
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

//prod
//db.sequelize.sync();

function initial() {
  Role.create({
    name: "user",
  });

  Role.create({
    name: "teacher",
  });

  Role.create({
    name: "admin",
  });

  Role.create({
    name: "1",
  });

  Role.create({
    name: "2",
  });

  Role.create({
    name: "3",
  });

  Role.create({
    name: "4",
  });

  Role.create({
    name: "5",
  });

  Role.create({
    name: "6",
  });

  Role.create({
    name: "7",
  });

  Role.create({
    name: "8",
  });

  Role.create({
    name: "9",
  });

  Role.create({
    name: "10",
  });

  Role.create({
    name: "12",
  });

  Group.create({
    name: "Учебная группа",
  });

  User.create({
    username: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345678", authConfig.saltRounds),
    name: "Админ",
    surname: "Админ",
    roleId: 3,
  });

  db.sequelize.query(
    `CREATE RULE InsteadOfDeleteRole AS ON DELETE TO roles
    DO INSTEAD NOTHING;`
  );

  db.sequelize.query(`ALTER TABLE public."groups"` +
  ` ADD CONSTRAINT "groups_creatorId_fkey" FOREIGN KEY ("creatorId") ` +
  ` REFERENCES public."users" (id) MATCH SIMPLE ON UPDATE SET NULL ON DELETE SET NULL`);
}

const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  // origin: 'http://localhost:8081',
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/keks.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/compile.routes")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
