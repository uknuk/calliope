var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db'),
    query = function(trx, id, ev='') {
      return trx.raw(
      `select ${db.aliases(fields, 'b')}, free, ${db.aliases(fields, 'e')} \
       ${ev} from bookings b join events e on b.event_id = e.id where b.id=?`,
      [id]
      );
    };

const fields = ["normal", "reduced", "troop", "service"];

router.post('/', function(req, res) {
  var ev,
      par = req.body;

  db.pg.transaction(function(trx) {
    return trx.raw(
      "select free, normal, reduced, troop, service from events \
       where events.id = ?",
      [par.event_id]
    )
      .then(function(r) {
        var qm = _.fill(Array(_.size(par)), '?').join(',');

        ev = r.rows[0];
        return trx.raw(
          `insert into bookings (${_.keys(req.body).join()}) values (${qm})`,
          _.values(par)
        );
      })
      .then(function() {
        _.each(fields, (f) => ev[f] += par[f]);
        ev.free -= par.normal + par.reduced + par.troop;
        return db.update(trx, 'events', ev, par.event_id);
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

router.put('/:id', function(req, res) {
  var cur, // current values
      par = req.body;

  db.pg.transaction(function(trx) {
    return query(trx, req.params.id)
      .then(function(r) {
        cur = r.rows[0];
        return db.update(trx, 'bookings', par, req.params.id);
      })
      .then(function() {
        var diff = {},
            res = {};
        console.log(cur);
        _.each(fields, function(f) {
          console.log(par[f]);
          diff[f] = par[f] - cur[`b_${f}`];
          res[f] = cur[`e_${f}`] + diff[f];
        });
        console.log(diff);
        res.free = cur.free - (diff.normal + diff.reduced + diff.troop);
        console.log(res);
        return db.update(trx, "events", res, par.event_id);
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

router.delete('/:id', function(req, res) {
  var cur,
      par = req.body;

  db.pg.transaction(function(trx) {
    return query(trx, req.params.id, ",event_id")
      .then(function(r) {
        cur = r.rows[0];
        return trx.raw("delete from bookings where id = ?", [req.params.id]);
      })
      .then(function() {
        var res = {};
        _.each(fields, (f) => res[f] = cur[`e_${f}`] - cur[`b_${f}`]);
        res.free =  cur.free + cur.b_normal + cur.b_reduced + cur.b_troop;
        return db.update(trx, 'events', res, cur.event_id);
      });
  })
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

module.exports = router;
