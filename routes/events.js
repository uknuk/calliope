var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db');

router.get('/', function(req, res) {
  var play,
      cols = "name, "
      sql = "select id, time, free";
      details = req.query.details == 'true';

  if (details && !req.isAuthenticated()) {
    return res.status(401).end();
  }

  if (details) {
    sql = "select *";
    cols += "capacity, ";
  }

  cols += "price, discount"
  sql += " from events where time > now() and active = true";

  db.pg.raw("select " + cols + " from plays")
    .then(function(r) {
      play = r.rows[0];
      return db.pg.raw(sql)
    })
    .then(r => res.json({play: play, events: r.rows}))
    .catch(err => db.error(err, res));
});

router.get("/:id", function(req, res) {
  db.pg.raw("select * from bookings where event_id = " + req.params.id)
    .then(r => res.json(r.rows))
    .catch(err => db.error(err, res));
});

router.post('/', function(req, res) {
  var values = [req.body['time']],
      sql = "insert into events (time, play_id, free, active) values (?,?,?,?)";

  db.pg.raw("select id, capacity from plays")
    .then(function(r) {
      var row = r.rows[0];
      values = values.concat([row.id, row.capacity, true]);
      return db.pg.raw(sql, values);
    })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});



module.exports = router;
