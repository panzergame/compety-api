const express = require('express');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const os = require("os");
const cors = require('cors');
const https = require('https');
const fs = require('fs');

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
app.use(cors());
app.set('jwtTokenSecret', 'compety-jwt-secret');

app.use(bodyParser.json());

/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
 
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

const jwtauth = require('./controllers/jwtauth.js');
const action = require('./controllers/action');
const auth = require('./controllers/auth.js');
const resource = require('./controllers/resource');
const sync = require('./controllers/sync');

// Appelle de jwtauth pour chaque appelle REST de l'api'
app.all('/api/action*', [jwtauth.needToken]);
app.all('/api/resource*', [jwtauth.optionalToken]);

// App Routes
app.get('/', (req, res) => res.send('hello world'));
app.post('/api/auth/login', auth.login);
// app.post('/api/sync/esco', sync.esco);
app.post('/api/auth/register', auth.register);
app.post('/api/action/user/competency/validate', action.user.validateCompetency);
app.post('/api/action/user/competency/remove', action.user.removeCompetency);
app.post('/api/action/user/notification/read', action.user.readNotification);
app.post('/api/action/group/create', action.group.create);
// app.post('/api/action/group/delete', action.group.delete);
app.post('/api/action/group/invite/accept', action.group.acceptInvite);
app.post('/api/action/group/invite/create', action.group.invite);

app.get('/api/resource/competency/validation/file', resource.competencyValidationFile);
app.get('/api/resource/competency/validation/photo', resource.competencyValidationPhoto);
app.get('/api/resource/competency/validation', resource.competencyValidation);
app.get('/api/resource/competency', resource.competency);
app.get('/api/resource/competency/search', resource.searchCompetencies);
app.get('/api/resource/section', resource.section);
app.get('/api/resource/user', resource.user);
app.get('/api/resource/group/competency/verify', resource.groupCompetenciesToVerify);
app.get('/api/resource/group', resource.group);
app.get('/api/resource/user/search', resource.searchUsers);
app.get('/api/resource/user/notification', resource.userNotifications);
app.get('/api/resource/user/group', resource.userGroups);
app.get('/api/resource/user/competency', resource.userCompetencies);


const PORT = 3001;

// App Server Connection
https.createServer({
  key: fs.readFileSync("./compety.com-key.pem"),
  cert: fs.readFileSync("./compety.com.pem")
}, app)
.listen(process.env.PORT || PORT, () => {
  console.log(`app is running on port ${process.env.PORT || PORT}`)
})
