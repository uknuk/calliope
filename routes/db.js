var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'knex,public'
});

exports.exec = function(sql, vals) {
  return pg.raw(sql, vals);
}

exports.error = function(err, res) {
  console.log(err);
  res.json({result: 'fail', msg: 'Database error'});
}

	


