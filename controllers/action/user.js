function validateCompetency(req, res) {
  const competencyId = req.body.params.id;
  const userId = req.user.id;
  db('User_Validated_Competency').insert({competency: competencyId, user: userId})
    .onConflict(['user', 'competency']).ignore()
    .then(res.json({competencyId}));
}

module.exports = {
  validateCompetency
} 
