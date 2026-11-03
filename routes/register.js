const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    res.render('register', { title: 'Register' });
});

module.exports = router;