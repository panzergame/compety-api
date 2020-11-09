const jwtauth = require('./jwtauth.js');

function login(req, res) {
  const login = req.body.login;
  const password = req.body.password;
  
  console.log("Login " + login + " " + password);

  db('User').where({login, password}).first().then(item => {
    if (item) {
      var data = jwtauth.token(login, password);
      // Copie des données de l'utilisateur en omettant le mot de passe
      data.user = {
        id: item.id,
        login: item.login,
        description: item.description,
        dayofbirth: item.dayofbirth
      };

      res.json(data);
    }
    else {
      res.end('Login or password incorrect');
    }
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
