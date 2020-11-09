function section(req, res) {
  const id = req.query.id;
  db('Section').where({id}).first().then(item => {
      res.json(item);
    }
  );
}

function competency(req, res) {
  const id = req.query.id;
  db('Competency').where({id}).first().then(competency => {
      if (competency) {
        if (req.user) {
          db('User_Validated_Competency').where({user: req.user.id, competency: competency.id}).first()
            .then(link => {
              competency.validated = Boolean(link);
              res.json(competency)
            }
          );
        }
        else {
          res.json(competency);
        }
      }
      else {
        
      }
    }
  );
}

module.exports = {
  competency,
  section
}
