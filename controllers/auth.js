const jwtauth = require('./jwtauth.js');

function login(req, res) {
  const login = req.body.login;
  const password = req.body.password;
  
  console.log("Login " + login + " " + password);

  db('User').where({login, password}).first().then(item => {
    var data = jwtauth.token(login, password);
    data.user = item;

    res.json(data);
  });
}

function register(req, res) {
  const _login = req.body.login;
  const password = req.body.password;
  
  console.log("Register " + _login + " " + password)
  
  db('User').insert({
    login: _login,
    password: password,
    dayofbirth: req.body.dayofbirth
  })
  .then(item => {
    login(req, res);
  })
  .catch(error => {
    console.error(error);
  });
}

module.exports = {
  login,
  register
}
