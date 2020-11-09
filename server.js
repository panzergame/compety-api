const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

// use process.env variables to keep private variables,
require('dotenv').config()

// db Connection w/ localhost
db = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : 'admin',
    database : 'compety'
  }
});

// App
app = express();
app.use(cors({origin: true, credentials: true}));
app.set('jwtTokenSecret', 'compety-jwt-secret');

const jwtauth = require('./controllers/jwtauth.js');
const action = require('./controllers/action');
const auth = require('./controllers/auth.js');
const resource = require('./controllers/resource');

app.all('/*', [bodyParser.json()])
// Appelle de jwtauth pour chaque appelle REST de l'api'
app.all('/api/action*', [jwtauth.needToken]);
app.all('/api/resource*', [jwtauth.optionalToken]);

// App Routes
app.get('/', (req, res) => res.send('hello world'));
app.post('/api/auth/login', auth.login);
app.post('/api/auth/register', auth.register);
app.post('/api/action/user/validateCompetency', action.user.validateCompetency);

app.get('/api/resource/competency', resource.competency);
app.get('/api/resource/section', resource.section);

const PORT = 3001;

// App Server Connection
app.listen(process.env.PORT || PORT, () => {
  console.log(`app is running on port ${process.env.PORT || PORT}`)
})
