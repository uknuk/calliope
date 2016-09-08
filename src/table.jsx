var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      sort: {},
      filter: {},
    }
  },
  render: function() {
    var inputs,
        rows = this.props.body;

    if (this.props.search) {
      inputs = this._getInputs(this.props.body);
      rows = this._filter(rows);
    }

    if (this.props.sort)
      rows = this._sort(rows);

    return (
      <table className='table table-bordered'>
	    <thead>
      <tr>
      {
        _.map(this.props.head, _.bind(function(name, idx) {
          return this._renderHeader(name, idx)
        }, this))
      }
      </tr>
      {inputs ? (
        <tr>
          {
             _.map(inputs, _.bind(function(col, idx) {
               return (<td key={idx}> {this._renderInput(col, idx)} </td>);
             }, this))
          }
        </tr>
      ) : null
      }
      </thead>
      <tbody>
        { this._renderRows(rows) }
      </tbody>
      <tfoot>
        {this._renderRows(this.props.foot)}
      </tfoot>
      </table>
    );
  },

  _renderRows: function(rows) {
    return  _.map(rows, _.bind(function(row, m) {
      return (
        <tr key={m}>
          {
             _.map(row, _.bind(function(col, n) {
               return this._renderCol(col, n)
             }, this))
          }
        </tr>
      )
    }, this));
  },

  _renderCol: function(col, m) {
    var val, span;
    if (_.isArray(col)) {
      val = col[0];
      span = col[1];
    }
    else if (_.isObject(col))
      val = col.val
    else
      val = col;

    return (<td key={m} colSpan={span || 1}>{val}</td>);
  },

  _renderHeader: function(name, idx) {
    if (this.props.sort && !_.isEmpty(name))
      return (
        <th key={idx} onClick={this._setSort.bind(null, idx)}>
        {name}&nbsp;
        <span className={"glyphicon glyphicon-sort" + this._sortIcon(idx)}/>
      </th>
      );
    else
      return (<th key={idx}>{name}</th>);
  },

  _renderInput: function(input, idx) {
    if (input)
      return (
        <input type='search' onChange={this._setFilter.bind(null, idx)}/>
      );
    else
      return ''
  },

  _sort: function(rows) {
    var dir, sort = this.state.sort;
    if (sort.col != undefined) {
      dir = sort.up ? 'asc' : 'desc';
      rows = _.orderBy(rows, function(row) {
        var val = row[sort.col].toLowerCase();
        if (_.isObject(val))
          val = val.handle;
        return _.includes(val,'%') ? parseFloat(val) : val
      }, dir);
    }
    return rows;
  },
  _filter: function(rows) {
    var filter = this.state.filter;
    if (_.isEmpty(filter))
      return rows;
    else
      return _.filter(rows, function(row) {
        var val = row[filter.col].toLowerCase();
        if (_.isObject(val))
          val = val.handle;
        return _.includes(val, filter.string);
      });
  },
  _sortIcon: function(col) {
    if (col == this.state.sort.col)
      return '-by-attributes' + (this.state.sort.up ? '' : '-alt');
    else
      return '';
  },
  _setSort: function(col) {
    this.setState({
      sort: {col: col, up: !this.state.sort.up}
    });
  },
  _setFilter: function(col, ev) {
    this.setState({
      filter: {col: col, string: ev.target.value}
      });
    },
  _getInputs: function(rows) {
    return _.map(_.keys(rows[0]), function(idx) {
      return _.some(rows, function(row) {
        var val = row[idx];
        if (_.isObject(val))
          val = val.handle;
        return _.isString(val) && !_.endsWith(val,'%');
      });
    });
  }
});
