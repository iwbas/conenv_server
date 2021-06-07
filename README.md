# conenv_server

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
#temp
```javascript
import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
// import jsonServerProvider from 'ra-data-json-server';
import simpleRestProvider from 'ra-data-simple-rest';

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const dataProvider= simpleRestProvider('http://localhost:8080/api');

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="roles" list={ListGuesser} />
    </Admin>
);

export default App;
```
