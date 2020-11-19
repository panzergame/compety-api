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
const sync = require('./controllers/sync');

app.all('/*', [bodyParser.json()])
// Appelle de jwtauth pour chaque appelle REST de l'api'
app.all('/api/action*', [jwtauth.needToken]);
app.all('/api/resource*', [jwtauth.optionalToken]);

// App Routes
app.get('/', (req, res) => res.send('hello world'));
app.post('/api/auth/login', auth.login);
// app.post('/api/sync/esco', sync.esco);
app.post('/api/auth/register', auth.register);
app.post('/api/action/user/validateCompetency', action.user.validateCompetency);
app.post('/api/action/user/removeCompetency', action.user.removeCompetency);
app.post('/api/action/user/readNotification', action.user.readNotification);
app.post('/api/action/group/create', action.group.create);
// app.post('/api/action/group/delete', action.group.delete);
app.post('/api/action/group/invite', action.group.invite);
app.post('/api/action/group/acceptInvite', action.group.acceptInvite);

app.get('/api/resource/competency', resource.competency);
app.get('/api/resource/competency/search', resource.searchCompetencies);
app.get('/api/resource/competency/all', resource.allCompetencies);
app.get('/api/resource/section', resource.section);
app.get('/api/resource/group', resource.group);
app.get('/api/resource/user/search', resource.searchUsers);
app.get('/api/resource/user/notification', resource.notifications);


const PORT = 3001;

// App Server Connection
app.listen(process.env.PORT || PORT, () => {
  console.log(`app is running on port ${process.env.PORT || PORT}`)
})
