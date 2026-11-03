const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = path.join(__dirname, '..', 'data', 'users.sqlite');

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL
  )
`);

const userColumns = database.prepare('PRAGMA table_info(users)').all();
if (userColumns.some((column) => column.name === 'verified')) {
  database.exec('ALTER TABLE users DROP COLUMN verified');
}

const insertUser = database.prepare(
  'INSERT INTO users (username, password_hash) VALUES (?, ?) ON CONFLICT(username) DO NOTHING'
);
const selectUser = database.prepare(
  'SELECT username, password_hash FROM users WHERE username = ?'
);

function createUser(username, passwordHash) {
  return insertUser.run(username, passwordHash).changes === 1;
}

function findUser(username) {
  const user = selectUser.get(username);
  if (!user) return null;

  return {
    username: user.username,
    passwordHash: user.password_hash
  };
}

module.exports = { createUser, findUser };