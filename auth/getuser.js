const { scrypt, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
var express = require('express');
const { findUser } = require('./database');
var router = express.Router();

const scryptAsync = promisify(scrypt);

router.get('/', function(req, res) {
  res.redirect('/login');
});

router.post('/', async function(req, res, next) {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = findUser(username);

    if (!user || typeof user.passwordHash !== 'string') {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const [salt, storedHash, extra] = user.passwordHash.split(':');
    if (extra !== undefined || !salt || !/^[a-f\d]{128}$/i.test(storedHash || '')) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const candidateHash = Buffer.from(await scryptAsync(password, salt, 64));
    const expectedHash = Buffer.from(storedHash, 'hex');
    if (!timingSafeEqual(candidateHash, expectedHash)) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    req.session.regenerate(function(error) {
      if (error) return next(error);

      req.session.user = { username: user.username };
      req.session.save(function(saveError) {
        if (saveError) return next(saveError);
        res.status(200).json({ message: 'Login successful.', redirect: '/' });
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;