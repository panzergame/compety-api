function validateCompetency(req, res) {
  const competencyId = req.body.competencyId;
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
  const competencyId = req.body.competencyId;
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

function readNotification(req, res) {
  const id = req.body.notificationId;
  const type = req.body.notification;

  if (type === 'invite') {
    db('Invite_Notification').where({id, user: req.user.id}).update({read: true}).returning('*')
    .then(notification => res.json(notification));
  }
}

module.exports = {
  validateCompetency,
  removeCompetency,
  readNotification
} 
