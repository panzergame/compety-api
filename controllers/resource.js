function section(req, res) {
  const id = req.query.id;
  console.log(id);
  db('Section').where({id}).first().then(item => {
      res.json(item);
    }
  );
}

function competency(req, res) {
  const id = req.query.id;
  console.log(id);
  db('Competency').where({id}).first().then(item => {
      res.json(item);
    }
  );
}

module.exports = {
  competency,
  section
}
