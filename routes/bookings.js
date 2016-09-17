var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db');


router.post('/', function(req, res) {
  var ev,
      par = req.body;

  db.pg.transaction(function(trx) {
    return trx.raw(`select free, normal, reduced, revenue, price, discount from events \
            join plays on events.play_id = plays.id where events.id = ${par.event_id}`)
      .then(function(r) {
        ev = r.rows[0];
        return trx.raw(
          `insert into bookings (${_.keys(req.body).join()}) values (?,?,?,?,?,?,?)`,
          _.values(par)
        )
      })
      .then(function() {
        ev.normal += par.normal;
        ev.reduced += par.reduced;
        ev.free -= par.normal + par.reduced;
        ev.revenue = parseFloat(ev.revenue) + ev.price*(par.normal + par.reduced*(1 - ev.discount));
        return trx.raw(
          `update events set free=?, normal=?, reduced=?, revenue=? where id=${par.event_id}`,
          [ev.free, ev.normal, ev.reduced, ev.revenue]
        );
      })
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});


router.delete('/:id', function(req, res) {
  db.pg.raw("delete from bookings where id = ?", [req.params.id])
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

module.exports = router;
