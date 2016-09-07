var express = require('express'),
    passport = require('passport'),
    router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/ui/events');
});

router.post('/api/login', passport.authenticate('json'), function(req, res) {
  res.json({result: 'ok'})
});

router.get('/ui/*', function(req, res) {
  res.render('index', { title: 'Calliope', token: 'req.csrfToken()'});
});

module.exports = router;
