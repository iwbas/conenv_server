// const db = require("./app/models");
const db = require('./app/models')
const User = db.user;
const Role = db.role;
const Group = db.group;

const bcrypt = require('bcryptjs');
const authConfig = require("./app/config/auth.config")

// dev
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

//prod
//db.sequelize.sync();

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "teacher"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  Role.create({
    id: 4,
    name: "1"
  });

  Role.create({
    id: 5,
    name: "2"
  });

  Role.create({
    id: 6,
    name: "3"
  });

  Role.create({
    id: 7,
    name: "4"
  });

  Role.create({
    id: 8,
    name: "5"
  });

  Role.create({
    id: 9,
    name: "6"
  });

  Role.create({
    id: 10,
    name: "7"
  });

  Role.create({
    id: 11,
    name: "8"
  });

  Role.create({
    id: 12,
    name: "9"
  });

  Role.create({
    id: 13,
    name: "10"
  });

  Role.create({
    id: 14,
    name: "12"
  });
  
  Group.create({
    id: 1,
    name: "Учебная группа"
  })

  User.create({
    "username": "admin",
    "email": "admin@gmail.com",
    "password": bcrypt.hashSync("12345678", authConfig.saltRounds),
    "name": "Админ",
    "surname": "Админ",
    "roleId": 3
  })
}

const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  // origin: 'http://localhost:8081',
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to application' });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/keks.routes')(app);
require('./app/routes/role.routes')(app);
require('./app/routes/group.routes')(app);
require('./app/routes/compile.routes')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
