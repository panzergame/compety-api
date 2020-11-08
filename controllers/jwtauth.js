const jwt = require('jwt-simple');
const moment = require('moment');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token, app.get('jwtTokenSecret'));

      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      else {
        const login = decoded.iss;
        db('User').where({login}).first().then(item => {
          req.user = item;
          console.log(req.user);
          next();
        });
      }
    }
    catch (err) {
      res.end('Access token invalid', 401);
    }
  }

  res.end('Access token missing', 401);
};

// Create token
function token(login, password) {
  const expires = moment().add(7, 'days').valueOf();
  const token = jwt.encode({
    iss: login,
    exp: expires
  }, app.get('jwtTokenSecret'));

  return {
    token : token,
    expires: expires,
  };
}

module.exports = {
  verifyToken,
  token
}
