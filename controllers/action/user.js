function streamToBase64(readable)
{
  return new Promise((resolve, reject) => {
    let data = '';
    readable.on('data', function (chunk) {
      data += chunk.toString('base64');
    });
    readable.on('end', function () {
      resolve(data);
    });
    readable.on('error', function (err) {
      reject(err);
    });
  });
}


function validateCompetency(req, res) {
  const competencyId = req.query.competencyId;
  const userId = req.user.id;
  const file = req.body.file;
  const photo = req.body.photo;

  // var buffer = new Buffer(base64string, 'base64');

  (async () => {
    const file64 = file ? await streamToBase64(file) : null;
    const photo64 = photo ? await streamToBase64(photo) : null;

    return [file64, photo64];
  })().then(files64 => {
    const [file64, photo64] = files64;
  
    db('User_Validated_Competency').insert({competency: competencyId, user: userId, file: file64, photo: photo64, verified: false})
      .onConflict(['user', 'competency']).merge()
      .then(
        db('Competency').where({id : competencyId}).first()
        .then(competency => {
          competency.validated = true;
          competency.verified = false;
          res.json(competency);
        })
      );
  });
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
