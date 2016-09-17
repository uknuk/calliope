var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx'),
    Table = require('./table.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  getInitialState: function() {
    return {
      loading: false,
      saved: false,
      alerts: {},
      id: this.props.routeParams.id,
      bookings: [],
    }
  },

  componentWillMount: function() {
    this.fetch();
  },

  render: function() {
    var date = lib.data.events ?
               new Date(lib.data.events[this.state.id].time).toLocaleString("de") : '';
    
    if (this.state.loading)
      return (<div> Loading ... </div>);
    return (
      <div className="container-fluid">
      { this.renderAlerts() }
      <h4>{"Bookings for " + date}</h4>
      <Table
          head={["Name", "Email", "Phone", "Normal", "Reduced", "Total", "Booked", '']}
          body={this.getRows()} search
      />
      </div>
    );
  },

  getRows: function() {
    return _.map(this.state.bookings, _.bind(function(entry) {
      return [
        entry.name,
        entry.email,
        entry.phone,
        entry.normal,
        entry.reduced,
        entry.normal*lib.data.price + entry.reduced*lib.data.reduced,
        new Date(entry.created_at).toLocaleString('de'),
        {
          val: (
            <button type="button" className="btn btn-xs btn-danger" onClick={this.disable.bind(null, entry.id)}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          )
        }
      ];
    }, this));
  },

  disable: function(id) {
    lib.save("/bookings/" + id, 'delete', {}, this);
  },

  onSaved: function() {
    this.fetch();
  },

  fetch: function() {
    lib.get("/events/" + this.state.id, this)
  },

  getData: function(resp) {
    this.setState({bookings: resp})
  }
});
