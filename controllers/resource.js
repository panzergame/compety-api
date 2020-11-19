function section(req, res) {
  const id = req.query.id;
  db('Section').where({id}).first().then(item => {
      res.json(item);
    }
  );
}

function competencyById(id, userId) {
  return db('Competency').where({id}).first().then(competency => {
      if (competency && userId) {
        return db('User_Validated_Competency').where({user: userId, competency: competency.id}).first()
          .then(link => {
            competency.validated = Boolean(link);
            return competency
          }
        );
      }
      return competency;
    }
  );
}

function competency(req, res) {
  const userId = req.user ? req.user.id : null;
  competencyById(req.query.id, userId).then(competency => res.json(competency));
}

function groupById(id) {
  return db('Group').where({id}).first().then(group => {
      return db('User_In_Group').join('User', 'User.id', 'User_In_Group.user')
      .where({group: group.id})
      .select('User.*', 'accepted')
      .then(users => {
        // Répartition des membres et invitations
        group.members = []
        group.invits = []
        users.map(user => {
          delete user.password;
          if (user.accepted) {
            group.members.push(user);
          }
          else {
            group.invits.push(user);
          }
        });

        return group;
      });
    }
  )
}

function group(req, res) {
  const id = req.query.id;
  groupById(req.query.id).then(group => res.json(group));
}

function searchCompetencies(req, res) {
  const query = req.query.query;
  const profileId = req.query.profileId;
  console.log(query, profileId);

  db('Competency').where('title', 'ilike', '\%' + query + '\%').then(competencies => {
    (async () => {
      let sectionsToCompetencies = {};
      for (const competency of competencies) {
        const idSection = competency.section;
        if (!sectionsToCompetencies[idSection]) {
          let section = await db('Section').where({id : idSection}).first();
          if (!section) {
            console.log(idSection);
          }
          else {
            section.competencies = [competency];
            sectionsToCompetencies[idSection] = section;
          }
        }
        else {
          sectionsToCompetencies[idSection].competencies.push(competency);
        }        
      }
      return Object.values(sectionsToCompetencies);
    })().then(result => {
      res.json(result);
    })
  });
}

function allCompetencies(req, res) {
  db('Competency').join('User_Validated_Competency', 'Competency.id', 'User_Validated_Competency.competency')
  .where({user: req.user.id}).then(competencies => {
    // TODO sections...
  });
}

function searchUsers(req, res) {
  const query = req.query.query;
  const role = req.query.role;

  console.log(query, role);
  
  let promise = db('User')
    .where('firstname', 'ilike', '\%' + query + '\%')
    .orWhere('lastname', 'ilike', '\%' + query + '\%');

  if (role) {
    promise = promise.where({role});
  }
    
  promise.then(users => {
    users.map(user => {
      delete user.password;
    });
    res.json(users);
  });
}

function notifications(req, res) {
  const userId = req.user.id;
  
  db('Invite_Notification').where({user: userId})
  .join('Group', 'Group.id', 'Invite_Notification.group')
  .orderBy('date').then(notifications => {
    notifications.map(notification => notification.type = 'invite');
    res.json(notifications);
  });
}

module.exports = {
  section,
  competency,
  group,
  searchCompetencies,
  allCompetencies,
  searchUsers,
  notifications
}
