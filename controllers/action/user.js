const fs = require('fs');

function streamToBase64(readable)
{
  return new Promise((resolve, reject) => {
    var chunks = [];
    readable.on('data', function (chunk) {
      chunks.push(chunk);
    });
    readable.on('end', function () {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString('base64'));
    });
    readable.on('error', function (err) {
      reject(err);
    });
  });
}


function validateCompetency(req, res) {
  const competencyId = req.query.competencyId;
  const userId = req.user.id;
  const fileName = req.query.fileName;
  const file = req.body.file;
  const photo = req.body.photo;
  const comment = req.query.comment;
  
  (async () => {
    const file64 = file ? await streamToBase64(file) : null;
    const photo64 = photo ? await streamToBase64(photo) : null;

    return [file64, photo64];
  })().then(files64 => {
    const [file64, photo64] = files64;
  
    db('User_Validated_Competency').where({competency: competencyId, user: userId}).select('id').orderBy('date', 'desc')
      .first().then(prev => {
      db('User_Validated_Competency').insert({competency: competencyId, user: userId, fileName, file: file64, photo: photo64, comment, prev: prev ? prev.id : null, date: new Date().toISOString()})
        .then(res.end())
        
      });
  });
}

function removeCompetency(req, res) {
  const competencyId = req.body.competencyId;
  const userId = req.user.id;
  db('User_Validated_Competency').where({competency: competencyId, user: userId}).del()
    .then(res.end());
}

function readNotification(req, res) {
  const id = req.body.notificationId;
  const type = req.body.notification;

  if (type === 'invite') {
    db('Invite_Notification').where({id, user: req.user.id}).update({read: true}).returning('*')
    .then(notification => res.json(notification));
  }
}

function acceptValidation(req, res) {
  const validationId = req.body.validationId;
  const verificatorUserId = req.user.id;
  db('User_Verified_Competency').insert({validation: validationId, validator: verificatorUserId})
    .onConflict(['validation', 'validator']).ignore().then(res.end());
}

function commentValidation(req, res) {
  const validationId = req.body.validationId;
  const verificatorUserId = req.user.id;
  const comment = req.body.comment;
  db('User_Commented_Validation').insert({validation: validationId, user: verificatorUserId, comment, date: new Date().toISOString()})
    .then(res.end());
}

module.exports = {
  validateCompetency,
  removeCompetency,
  readNotification,
  acceptValidation,
  commentValidation
} 
