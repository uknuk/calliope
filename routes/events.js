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

  db.exec("select " + cols + " from plays")
    .then(r => r.rows[0])
    .then(function(r) {
      play = r;
      return db.exec(sql)
    })
    .then(r => res.json({play: play, events: r.rows}))
    .catch(err => db.error(err, res));
});

router.get("/:id", function(req, res) {
  db.exec("select * from bookings where event_id = " + req.params.id)
    .then(r => res.json(r.rows))
    .catch(err => db.error(err, res));
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

router.post('/book', function(req, res) {
  var sql = _.template(
    "insert into bookings (${vars}) values (?,?,?,?,?,?,?)"
  )({vars: _.keys(req.body).join()});

  db.exec(sql, _.values(req.body))
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

router.delete('/:id', function(req, res) {
  db.exec("delete from bookings where id = ?", [req.body.id])
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});


module.exports = router;
