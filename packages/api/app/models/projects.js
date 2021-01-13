let db;
let users;

async function getUserProjects({userId}) {
  db.query('select * from projects where user_id = ?')
}

function init({dbValue, usersValue}) {
  db = dbValue;
  users = usersValue;
}

module.exports = {
  init,
  getUserProjects,
}