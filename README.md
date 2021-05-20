﻿# conenv_server

## app/config/auth.config.js

```javascript
module.exports = {
    secret: "secret-key"
}
```

## app/config/db.config.js
```javascript
module.exports = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'password',
  DB: 'db',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
```
