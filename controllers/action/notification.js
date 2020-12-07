var userSubscriptions = {};

function createNotification(user, type, params) {
    return db(type).insert(Object.assign({user, date: new Date().toISOString(), read: false}, params)).then(
//       webpush.sendNotification(userSubscriptions[user], 'Hello')
    );
}

function read(req, res) {
  const id = req.body.notificationId;
  const type = req.body.notification;

  if (type === 'invite') {
    db('Invite_Notification').where({id, user: req.user.id}).update({read: true}).returning('*')
    .then(notification => res.json(notification));
  }
}

function subscribe(req, res) {
  const subscription = req.body.subscription;

  userSubscriptions[req.user.id] = subscription;

  res.end('Ok');
}
    
module.exports = {
  read,
  createNotification,
  subscribe
}
