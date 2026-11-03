const { randomBytes, scrypt } = require('crypto');
const { promisify } = require('util');
var express = require('express');
const { createUser } = require('./database');
var router = express.Router();

const scryptAsync = promisify(scrypt);

router.post('/', async function(req, res, next) {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const salt = randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt, 64);
    const passwordHash = `${salt}:${Buffer.from(hash).toString('hex')}`;

    if (!createUser(username, passwordHash)) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    req.session.regenerate(function(sessionError) {
      if (sessionError) return next(sessionError);

      req.session.user = { username };
      req.session.save(function(saveError) {
        if (saveError) return next(saveError);
        res.status(201).json({ message: 'User added.', redirect: '/' });
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;