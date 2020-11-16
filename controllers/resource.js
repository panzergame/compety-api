function section(req, res) {
  const id = req.query.id;
  db('Section').where({id}).first().then(item => {
      res.json(item);
    }
  );
}

function competency(req, res) {
  const id = req.query.id;
  console.log(id);
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
        res.json(competency);
      }
    }
  );
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
  
}

module.exports = {
  competency,
  searchCompetencies,
  allCompetencies,
  section
}
