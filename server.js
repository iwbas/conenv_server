const db = require('./app/models');
const User = db.user;
const Role = db.role;
const Group = db.group;

const bcrypt = require('bcryptjs');
const authConfig = require('./app/config/auth.config');

// dev
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

//prod
//db.sequelize.sync();

function initial() {
  Role.create({
    name: 'user',
  });

  Role.create({
    name: 'teacher',
  });

  Role.create({
    name: 'admin',
  });

  Group.create({
    name: 'Учебная группа',
  });

  User.create({
    username: 'admin',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('12345678', authConfig.saltRounds),
    name: 'Админ',
    surname: 'Админ',
    roleId: 3,
  });

  User.create({
    username: 'teacher',
    email: 'teacher@gmail.com',
    password: bcrypt.hashSync('12345678', authConfig.saltRounds),
    name: 'Учитель',
    surname: 'Учитель',
    roleId: 2,
    groupId: 1,
  });

  db.topic.create({
    name: 'Тема 1',
    userId: 1,
  });

  db.task.create({
    name: "Название",
    content: 'Контент',
    answer: 'Hello, world',
    topicId: 1,
    userId: 1,
  });

  db.contest.create({
    name: 'контест',
    start: '2021-06-19 22:08:21.591+04',
    end: '2021-06-19 22:08:21.591+04',
    taskId: 1,
    groupId: 1,
  });

  db.sequelize.query(
    `CREATE RULE InsteadOfDeleteRole AS ON DELETE TO roles
    DO INSTEAD NOTHING;`
  );

  // db.sequelize.query(`ALTER TABLE public."groups"` +
  // ` ADD CONSTRAINT "groups_creatorId_fkey" FOREIGN KEY ("creatorId") ` +
  // ` REFERENCES public."users" (id) MATCH SIMPLE ON UPDATE SET NULL ON DELETE SET NULL`);
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');

const app = express();

var corsOptions = {
  // origin: 'http://localhost:8081',
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(authConfig.secret));

//https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81
// const csrfProtection = csrf({
//   cookie: true
// });

// app.use(csrfProtection);

// app.get('/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to application' });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/role.routes')(app);
require('./app/routes/group.routes')(app);
require('./app/routes/topic.routes')(app);
require('./app/routes/task.routes')(app);
require('./app/routes/contest.routes')(app);
require('./app/routes/compile.routes')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
