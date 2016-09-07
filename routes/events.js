var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db');

router.get('/', function(req, res) {
  var sql = "select id, time, free from events where time > now() and active = true",
      details = req.query.details == 'true';

  if (details && !req.isAuthenticated()) {
    return res.status(401).end();
  }

  if (details)
    sql = "select * from events where time > now() and active = true"

  db.exec(sql)
    .then( r => res.json(r.rows) )
    .catch( err => db.error(err, res));
});

router.post('/', function(req, res) {
  var fields = _.keys(req.body),
      values = _.values(req.body);

  var sql =  _.template(
    "insert into times (${vars}) values (?,?,?,?,?)"
  )({'vars': fields.join()});


  db.exec(sql, values)
    .then(() => respond(res))
    .catch( err => db.error(err, res));
});


module.exports = router;
