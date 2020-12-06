const axios = require('axios');

const ESCO_URL = "http://localhost:8080"

async function esco(req, res) {
  console.log("esco url: ", ESCO_URL);

  for (let offset = 0; offset < 656; offset += 50) {
    console.log("section", offset);
    let res = await axios.get(ESCO_URL + "/resource/skill?isInScheme=http://data.europa.eu/esco/concept-scheme/skills-hierarchy&language=fr&offset=" + offset + "&limit=50&full=true").then(response => {
      const raw_sections = response.data._embedded;
    
      Object.values(raw_sections).forEach(raw_section => {
        const id = raw_section.uri;
        const title =  raw_section.preferredLabel.fr ? raw_section.preferredLabel.fr : '';
        const description = raw_section.description ? raw_section.description.en.literal : '';
        const parentSection = raw_section._links.broaderConcept;

        const section = parentSection ? parentSection[0].uri : null;
        db('Section').insert({id, title, description, section}).then(item => {
//           console.log(id);
        });
      });
    });
  }
  
  for (let offset = 0; offset < 13485; offset += 50) {
    console.log("competency", offset);
    let res = await axios.get(ESCO_URL + "/resource/skill?isInScheme=http://data.europa.eu/esco/concept-scheme/member-skills&language=fr&offset=" + offset + "&limit=50&full=true").then(response => {
      const raw_competencies = response.data._embedded;
    
      Object.values(raw_competencies).forEach(raw_competency => {
        const id = raw_competency.uri;
        const type = raw_competency._links.hasSkillType[0].title;
        const title =  raw_competency.preferredLabel.fr ? raw_competency.preferredLabel.fr : '';
        const description = raw_competency.description.fr.literal;
        const parentSection = raw_competency._links.broaderHierarchyConcept;
        const parentSkill = raw_competency._links.broaderSkill;
        const narrowerSkill = raw_competency._links.narrowerSkill;

        // Les skill generaliste sont considéré comme des sections
        if (narrowerSkill) {
          const section = parentSection[0].uri;
          db('Section').insert({id, title, description, section}).then(item => {
//             console.log(id);
          });
        }
        else {
          const section = parentSkill ? parentSkill[0].uri : parentSection[0].uri;
          db('Competency').insert({id, title, type, description, section}).then(item => {
//             console.log(id);
          });
        }
      });
    });
  }
}

module.exports = {
  esco
}
