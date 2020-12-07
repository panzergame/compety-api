const jwt = require('jwt-simple');
const moment = require('moment');

function verifyToken(token, req, res, next) {
  try {
    const decoded = jwt.decode(token, app.get('jwtTokenSecret'));

    if (decoded.exp <= Date.now()) {
      res.end('Access token has expired', 400);
    }
    else {
      const login = decoded.iss;
      db('User').where({login}).first().then(item => {
        req.user = item;
        next();
      });
    }
  }
  catch (err) {
    res.end('Access token invalid', 401);
  }
}

function needToken(req, res, next) {
  // Pour GET le token est dans headers et dans body.headers pour un POST
  const token = req.headers['x-access-token'] || req.body.headers['x-access-token'];
  if (token) {
    verifyToken(token, req, res, next);
  }
  else {
    res.end('Access token missing', 401);
  }
};

function optionalToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    verifyToken(token, req, res, next);
  }
  else {
    next();
  }
}
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
  needToken,
  optionalToken,
  token
}
