var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('login', { title: 'Login' });
});

module.exports = router;
