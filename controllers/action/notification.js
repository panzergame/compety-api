function createNotification(user, type, params) {
    return db(type).insert(Object.update({user, date: new Date().toISOString(), read: false}, params));
}
    
module.exports = {
  createNotification
}
