var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db');


router.post('/', function(req, res) {
  var ev,
      par = req.body;

  db.pg.transaction(function(trx) {
    return trx.raw(
      "select free, normal, reduced, price, troop, discount from events \
       join plays on events.play_id = plays.id where events.id = ?",
      [par.event_id]
    )
      .then(function(r) {
        ev = r.rows[0];
        console.log(_.values(par));
        return trx.raw(
          `insert into bookings (${_.keys(req.body).join()}) values (?,?,?,?,?,?,?,?,?)`,
          _.values(par)
        );
      })
      .then(function() {
        ev.normal += par.normal;
        ev.reduced += par.reduced;
        ev.troop += par.troop;
        ev.free -= par.normal + par.reduced + par.troop;
        return trx.raw(
          "update events set free=?, normal=?, reduced=?, troop=? where id=?",
          [ev.free, ev.normal, ev.reduced, ev.troop, par.event_id]
        );
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

router.put('/:id', function(req, res) {
  var d,
      par = req.body;

  db.pg.transaction(function(trx) {
    return trx.raw(
      "select b.normal as bnormal, b.reduced as breduced, b.troop as btroop, free, price, \
       e.normal as enormal, e.reduced as ereduced, e.troop as etroop, discount from bookings b \
       join events e on b.event_id = e.id join plays on e.play_id = plays.id where b.id=?",
      [req.params.id]
    )
      .then(function(r) {
        d = r.rows[0];
        return trx.raw(
          "update bookings set name=?, email=?, phone=?, normal=?, reduced=?, troop=?, message=? where id=?",
          [par.name, par.email, par.phone, par.normal, par.reduced, par.troop, par.message, req.params.id]
        );
      })
      .then(function() {
        var ndiff = par.normal - d.bnormal,
            rdiff = par.reduced - d.breduced,
            gdiff = par.troop - d.btroop;

        d.enormal += ndiff;
        d.ereduced += rdiff;
        d.etroop += gdiff;
        d.free -= ndiff + rdiff + gdiff;
        console.log(d);
        return trx.raw(
          "update events set free=?, normal=?, reduced=?, troop=?  where id=?",
          [d.free, d.enormal, d.ereduced, d.etroop, par.event_id]
         );
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

router.delete('/:id', function(req, res) {
  var d,
      par = req.body;

  db.pg.transaction(function(trx) {
    return trx.raw(
       "select b.normal as bnormal, b.reduced as breduced, b.troop as btroop, event_id, free, \
       e.normal as enormal, e.reduced as ereduced, e.troop as etroop, price, discount from bookings b \
       join events e on b.event_id = e.id join plays on e.play_id = plays.id where b.id=?",
      [req.params.id]
    )
      .then(function(r) {
        d = r.rows[0];
        return trx.raw("delete from bookings where id = ?", [req.params.id]);
      })
      .then(function() {
        d.enormal -= d.bnormal;
        d.ereduced -= d.breduced;
        d.etroop -= d.btroop;
        d.free +=  d.bnormal + d.breduced + d.btroop;
        return trx.raw(
          "update events set free=?, normal=?, reduced=?, troop=? where id=?",
          [d.free, d.enormal, d.ereduced, d.etroop, d.event_id]
        );
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

module.exports = router;
