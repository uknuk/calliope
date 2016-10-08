var _ = require('lodash');

exports.pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'knex,public'
});


exports.error = function(err, res) {
  console.log(err);
  res.json({result: 'fail', msg: 'Database error'});
};

exports.update = function(handle, table, obj, id) {
  var sql = `update ${table} set ` +
        _.map(_.keys(obj), (key) => `${key}=?`).join(',') +
        " where id=?";

  return handle.raw(sql, _.concat(_.values(obj), [id]));
};

exports.aliases = function(fields, prefix) {
  return _.map(fields, (f) => `${prefix}.${f} as ${prefix}_${f}`)
    .join(',');
};
