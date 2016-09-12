var router = require('express').Router(),
    _ = require('lodash'),
    db = require('./db');


router.post('/', function(req, res) {
  var sql =
      `insert into bookings (${_.keys(req.body).join()}) values (?,?,?,?,?,?,?)`;

  db.exec(sql, _.values(req.body))
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});


router.delete('/:id', function(req, res) {
  db.exec("delete from bookings where id = ?", [req.params.id])
    .then(() => res.json({result: 'ok'}))
    .catch( err => db.error(err, res));
});

module.exports = router;
