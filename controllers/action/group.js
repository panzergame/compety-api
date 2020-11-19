function create(req, res) {
  const creator = req.user.id;
  const body = req.body;
  db('Group').insert({creator, title: body.title, description: body.description})
  .returning('*').then(groups => {
    const [group] = groups;
    // Le créateur est membre du groupe par défaut
    db('User_In_Group').insert({user: creator, group: group.id, accepted: true}).then(item => {
      group.members = [creator];
      console.log("create group: ", group); 
      res.json(group);
    });
  });
}

function invite(req, res) {
  const body = req.body;
  // TODO permission

  db('User_In_Group').insert({user: body.userId, group: body.groupId, accepted: false})
  .onConflict(['user', 'group']).ignore()
  .returning('*').then(item => {
    db('Invite_Notification').insert({user: body.userId, group: body.groupId, date: new Date().toISOString(), read: false})
      .then(() => {
        res.json(item[0]);
      });
  });
}

function acceptInvite(req, res) {
  const body = req.body;
  db('User_In_Group').where({user: req.user.id, group: body.groupId}).update({accepted: true})
  .returning('*').then(item => {
    res.json(item[0]);
  });
}

module.exports = {
  create,
  invite,
  acceptInvite
} 
