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
  var values = [req.body['time']],
      sql =  _.template(
        "insert into events (${vars}) values (?,?,?,?)"
      )({vars: ['time', 'play_id', 'free', 'active']});

  db.exec("select id, capacity from plays")
    .then(function(r) {
      var row = r.rows[0];
      values = values.concat([row.play_id, row.capacity, 'true']);
      return db.exec(sql, values);
    })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

module.exports = router;
