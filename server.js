const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

// use process.env variables to keep private variables,
require('dotenv').config()

// db Connection w/ localhost
var db = require('knex')({ // TODO db en global ?
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'admin',
    password : 'admin',
    database : 'compety'
  }
});

// App
app = express();
app.use(cors({origin: true, credentials: true}));
app.set('jwtTokenSecret', 'compety-jwt-secret');

// Controllers - aka, the db queries
const main = require('./controllers/main');
const jwtauth = require('./controllers/jwtauth.js');

app.all('/*', [bodyParser.json()])
// Appelle de jwtauth pour chaque appelle REST de l'api'
app.all('/api/*', [jwtauth]);

// App Routes
app.get('/', (req, res) => res.send('hello world'));
app.post('/login', (req, res) => main.login(req, res, db));
app.get('/api/test', main.test);

// app.get('/api/test1', (req, res) => main.test1(req, res));

const PORT = 3001

// App Server Connection
app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT || 3001}`)
})
