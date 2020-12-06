const stream = require('stream');
const fs = require('fs');

function user(req, res) {
  const id = req.query.id;
  
  db('User').where({id}).first().then(user => {
    if (user) {
      delete user.password;
    }
    res.json(user);
  });
}

function section(req, res) {
  const id = req.query.id;
  const userId = req.user ? req.user.id : null;
  sectionById(id).then(section => {
    let query = db('Competency')
    .leftJoin(latestValidation(userId), 'Competency.id', 'Latest_Validation.competency')
    .leftJoin('User_Verified_Competency', 'Latest_Validation.id', 'User_Verified_Competency.validation')
    .select(['User_Verified_Competency.id as verification', 'Latest_Validation.id as validation', 'Latest_Validation.date as date', 'Competency.*'])
    .where({section: id});
    
    query.then(competencies => {
      competencies.map(competency => {
        competency.validated = {verification: competency.verification, validation: competency.validation};
        delete competency.verification;
        delete competency.validation;
      });

      section.competencies = competencies;
      res.json(section);
    })
  });
}

function latestValidation(userId) {
    var query = db('User_Validated_Competency')
        .select([db.raw('max(id) id'), 'competency', db.raw('max(date) date')])
        .groupBy('competency').as('nested');

    if (userId) {
      query = query.where({user: userId});
    }

    return db.select([db.raw('nested.*')]).from(query)
      .as('Latest_Validation');
}

function latestValidationJoin(query) {
  const latest = db('User_Validated_Competency')
    .select(['competency', db.raw('max(date) date')])
    .groupBy('competency').as('Latest_Validation');

  return query.join(latest, function() { 
        this.on('User_Validated_Competency.competency', '=', 'Latest_Validation.competency')
        .andOn('User_Validated_Competency.date', '=', 'Latest_Validation.date')
  });
}

function competencyById(id, userId) {
  return db('Competency').where({id}).first().then(competency => {
      if (competency && userId) {
        const query = db('User_Validated_Competency')
          .leftJoin('User_Verified_Competency', 'User_Validated_Competency.id', 'User_Verified_Competency.validation')
          .where({'User_Validated_Competency.user': userId, 'User_Validated_Competency.competency': competency.id})
          .select(['User_Verified_Competency.id as verification', 'User_Validated_Competency.id as validation']);
          
        return latestValidationJoin(query).first().then(link => {
            if (link) {
              competency.validated = link;
            }
            return competency;
        });
      }
      else {
        return competency;
      }
    }
  );
}

function sectionById(id) {
  return db('Section').
      join('Competency', 'Section.id', 'Competency.section')
      .leftJoin('User_Validated_Competency', 'User_Validated_Competency.competency', 'Competency.id')
      .leftJoin('User_Verified_Competency', 'User_Verified_Competency.validation', 'User_Validated_Competency.id')
      .groupBy('Section.id')
      .select('Section.*',
              db.raw('count("Competency"."id") as total'),
              db.raw('count("User_Verified_Competency"."id") as verified'))
      .where({'Section.id' : id}).first();
}

async function comptenciesInSections(competencies) {
  let sectionsToCompetencies = {};
  for (const competency of competencies) {
    const idSection = competency.section;
    if (!sectionsToCompetencies[idSection]) {
      let section = await sectionById(idSection);
      if (!section) {
        console.log("manquant", idSection);
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
}

function competencyValidation(req, res) {
  const validationId = req.query.validationId;

  return db('User_Validated_Competency')
    .join('Competency', 'Competency.id', 'User_Validated_Competency.competency')
    .join('User', 'User.id', 'User_Validated_Competency.user')
    .leftJoin('User_Verified_Competency', 'User_Verified_Competency.validation', 'User_Validated_Competency.id')
    .leftJoin('User as Verificator', 'Verificator.id', 'User_Verified_Competency.validator')
    .where({'User_Validated_Competency.id': validationId})
    .select(['User_Validated_Competency.id', 'user', 'competency', 'fileName', 'comment', 'prev',
            'User.firstname', 'User.lastname', 'User.login', 'Competency.title',
            'Verificator.firstname as verificator_firstname', 'Verificator.lastname as verificator_lastname'
            ])
    .select(db.raw('"file" is not null hasfile, "photo" is not null hasphoto'))
    .first().then(validation =>      
        db('User_Commented_Validation')
        .join('User', 'User.id', 'User_Commented_Validation.user')
        .where({validation: validationId})
          .select('User_Commented_Validation.id', 'user', 'comment', 'date', 'User.firstname', 'User.lastname')
          .then(comments => {
            validation.comments = comments;
            res.json(validation);
          })
    );
}

function competencyValidationFile(req, res) {
  return db('User_Validated_Competency').where({id: req.query.validationId})
    .select('fileName', 'file').first()
    .then(link => {
      if (link.file) {
        const buffer = Buffer.from(link.file, 'base64');
        const readStream = stream.PassThrough();
        readStream.end(buffer);

        res.set('Content-disposition', 'attachment; filename=' + link.fileName);

        readStream.pipe(res);
      }
      else {
        res.end('Ok');
      }
    });
}

function competencyValidationPhoto(req, res) {
  return db('User_Validated_Competency').where({id: req.query.validationId})
    .select('photo').first()
    .then(link => {
      if (link.photo) {
        const buffer = Buffer.from(link.photo, 'base64');

        res.set('Content-type', 'image/png');

        const readStream = stream.PassThrough();
        readStream.end(buffer);
        readStream.pipe(res);
      }
      else {
        res.end('Ok');
      }
    });
}

function competency(req, res) {
  const userId = req.query.userId ? req.query.userId : (req.user ? req.user.id : null);
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
  const user = req.user;

  db('Competency').where('title', 'ilike', '\%' + query + '\%').then(competencies => {
    // Recupération de la validation
    if (user) {
      const promises = competencies.map(competency => {
        const query = db('User_Validated_Competency')
          .where({'User_Validated_Competency.user': user.id, 'User_Validated_Competency.competency': competency.id})
          .leftJoin('User_Verified_Competency', 'User_Validated_Competency.id', 'User_Verified_Competency.validation')
          .select(['User_Verified_Competency.id as verification', 'User_Validated_Competency.id as validation', 'User_Validated_Competency.date as date']);

          return latestValidationJoin(query).first().then(link => {
            if (link) {
              console.log("valid");
              competency.validated = link;
            }
            return competency;
          });
      });
      Promise.all(promises).then(competencies => {
        comptenciesInSections(competencies).then(sections => res.json(sections));
      });
    }
    else {
        comptenciesInSections(competencies).then(sections => res.json(sections));      
    }
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

function userNotifications(req, res) {
  const userId = req.user.id;
  
  db('Invite_Notification').where({user: userId})
  .join('Group', 'Group.id', 'Invite_Notification.group')
  .orderBy('date').then(notifications => {
    notifications.map(notification => notification.type = 'invite');
    res.json(notifications);
  });
}

function userGroups(req, res) {
  const userId = req.user.id;
  
  db('Group')
  .join('User_In_Group', 'Group.id', 'User_In_Group.group')
  .where({user: userId, accepted: true})
  .select('Group.*')
  .then(groups => {
    res.json(groups);
  });
}

function userCompetencies(req, res) {
  let query = db('Competency')
  .join('User_Validated_Competency', 'Competency.id', 'User_Validated_Competency.competency')
  .leftJoin('User_Verified_Competency', 'User_Validated_Competency.id', 'User_Verified_Competency.validation')
  .select(['User_Verified_Competency.id as verification', 'User_Validated_Competency.id as validation', 'User_Validated_Competency.date as date', 'Competency.*'])
  .where({user: req.user.id});
  
  
  latestValidationJoin(query).then(competencies => {
    competencies.map(competency => {
      competency.validated = {verification: competency.verification, validation: competency.validation};
      delete competency.verification;
      delete competency.validation;
    });

    comptenciesInSections(competencies).then(sections => res.json(sections));
  });
}

function groupCompetenciesToVerify(req, res) {
  const query = db('Competency')
    .join('User_Validated_Competency', 'Competency.id', 'User_Validated_Competency.competency')
    .leftJoin('User_Verified_Competency', 'User_Validated_Competency.id', 'User_Verified_Competency.validation')
    .join('User_In_Group', 'User_Validated_Competency.user', 'User_In_Group.user')
    .join('Group', 'Group.id', 'User_In_Group.group')
    .join('User', 'User.id', 'User_In_Group.user')
    .where({'Group.id': req.query.groupId})
    .whereNot({'User_In_Group.user': req.user.id})
    .whereNull('User_Verified_Competency.id')
    .select('Competency.*', 'User_Validated_Competency.id as validation', 'User_Validated_Competency.date as date', 'User.id as userId', 'User.firstname', 'User.lastname', 'User.login');

  latestValidationJoin(query).then(competencies => {
    comptenciesInSections(competencies).then(sections => res.json(sections));
  });
}

module.exports = {
  user,
  section,
  competency,
  competencyValidation,
  competencyValidationFile,
  competencyValidationPhoto,
  group,
  searchCompetencies,
  searchUsers,
  userNotifications,
  userGroups,
  userCompetencies,
  groupCompetenciesToVerify
}
