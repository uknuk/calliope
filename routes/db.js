exports.pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'knex,public'
});


exports.error = function(err, res) {
  console.log(err);
  res.json({result: 'fail', msg: 'Database error'});
}

	


