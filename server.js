// const db = require("./app/models");
const db = require('./app/models')
const User = db.user;
const Role = db.role;

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
require('./app/routes/role.routes')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
