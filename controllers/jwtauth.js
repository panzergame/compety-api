var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token, app.get('jwtTokenSecret'));

      console.log(decoded);
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      else {
        // TODO verify and extract
        req.user = decoded.iss;
        next();
      }
    }
    catch (err) {
      res.end('Access token invalid', 401);
    }
  }

  res.end('Access token missing', 401);
};
