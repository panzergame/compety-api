function validateCompetency(req, res) {
  const competencyId = req.body.params.competencyId;
  const userId = req.user.id;
  db('User_Validated_Competency').insert({competency: competencyId, user: userId})
    .onConflict(['user', 'competency']).ignore()
    .then(
      db('Competency').where({id : competencyId}).first()
      .then(competency => {
        competency.validated = true;
        res.json(competency);
      })
    );
}

function removeCompetency(req, res) {
  const competencyId = req.body.params.competencyId;
  const userId = req.user.id;
  db('User_Validated_Competency').where({competency: competencyId, user: userId}).del()
    .then(
      db('Competency').where({id : competencyId}).first()
      .then(competency => {
        competency.validated = false;
        res.json(competency);
      })
    );
}

module.exports = {
  validateCompetency,
  removeCompetency
} 
