const jwtauth = require('./jwtauth.js');

function login(req, res) {
  const login = req.body.login;
  const password = req.body.password;
  
  console.log("Login " + login + " " + password);

  db('User').where({login, password}).first().then(user => {
    if (user) {
      var data = jwtauth.token(login, password);
      // Copie des données de l'utilisateur en omettant le mot de passe
      delete user.password;
      data.user = user;

      // Recupération du nombre de notifications en attente
      db('Notification').where({user: user.id}).count('*').first().then(item => {
        user.notificationCount = item.count;
        res.json(data);
      });
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
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    dayofbirth: req.body.dayofbirth,
    role: req.body.role
  })
  .then(item => login(req, res))
  .catch(error => console.error(error));
}

module.exports = {
  login,
  register
}
