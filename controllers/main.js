const jwt = require('jwt-simple');
const moment = require('moment');

/*const getTableData = (req, res, db) => {
  db.select('*').from('testtable1')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const postTableData = (req, res, db) => {
  const { first, last, email, phone, location, hobby } = req.body
  const added = new Date()
  db('testtable1').insert({first, last, email, phone, location, hobby, added})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const putTableData = (req, res, db) => {
  const { id, first, last, email, phone, location, hobby } = req.body
  db('testtable1').where({id}).update({first, last, email, phone, location, hobby})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteTableData = (req, res, db) => {
  const { id } = req.body
  db('testtable1').where({id}).del()
    .then(() => {
      res.json({delete: 'true'})
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}*/

function login(req, res, db) {
  var expires = moment().add(7, 'days').valueOf();
  
  // TODO check user
//       return res.send(401);

  console.log(req.body);
  
  const login = req.body.login;
  const password = req.body.password;
  console.log("Login " + login + " " + password)
  
  var token = jwt.encode({
    iss: 42,
    exp: expires
  }, app.get('jwtTokenSecret'));

  res.json({
    token : token,
    expires: expires,
    user: login
//     user: user.toJSON()
  });
}

const test = (req, res) => {
    res.send('Mihahahaha');
}

module.exports = {
  test,
  login
}
