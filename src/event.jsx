var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx'),
    Booker = require('./booker.jsx'),
    Table = require('./table.jsx'),
    Popover = require('./popover.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      loading: false,
      saved: false,
      alerts: {},
      id: this.props.routeParams.id,
      bookings: [],
      print: false
    }
  },

  componentWillMount: function() {
    if (!lib.data.price) {
      this.context.router.push('/ui/admin/events');
      return;
    }

    window.matchMedia('print').addListener(_.bind(function(mql) {
      this.setState({print: mql.matches});
    }, this));

    this.fetch();
  },

  render: function() {
    var headers = ["Name", "Email", "Phone", "Normal", "Reduced", "Group", "Payment"]
        date = lib.data.events ?
               lib.showDate(new Date(lib.data.events[this.state.id].time)) : '';

    if (this.state.print)
      headers.push("Booked")
    else
      headers = headers.concat(["Message", "Booked", '']);

    if (this.state.loading)
      return (<div> Loading ... </div>);
    return (
      <div className="container-fluid">
      { this.renderAlerts() }
      <h4>{"Bookings for " + date}</h4>
      <Table head={headers} body={this.getRows()} search />
      <Booker onClose={this.close}/>
      <Link className="btn btn-default" to="/ui/admin/events">Back</Link>
      </div>
    );
  },

  getRows: function() {
    return _.map(this.state.bookings, _.bind(function(b) {
      var row = [
        b.name,
        b.email,
        b.phone,
        b.normal,
        b.reduced,
        b.troop,
        (b.normal*lib.data.price + (b.reduced + b.troop)*lib.data.reduced).toFixed(2),
      ];

      if (!this.state.print) {
        row.push({
          val: _.isEmpty(b.message) ? null :
          (<Popover placement="left">{b.message}</Popover>)
        });
      }

      row.push(lib.showDate(new Date(b.created_at)));

      if (!this.state.print) {
        row.push({
          val: (
            <div className="btn-toolbar">
              <button type="button" className="btn btn-xs btn-success" data-toggle="modal"
                      data-target="#booker" data-event={this.state.id} data-booking={b.id}
              >
                <span className="glyphicon glyphicon-edit"></span>
              </button>
            <button type="button" className="btn btn-xs btn-danger" onClick={this.delete.bind(null, b.id)}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
            </div>
          )
        });
      }

      return row;
    }, this));
  },

  delete: function(id) {
    lib.save("/bookings/" + id, 'delete', {}, this);
  },

  close: function() {
    // besides updating this function also needed for refreshing default values in modal
    this.fetch();
  },

  onSaved: function() {
    this.fetch();
  },

  fetch: function() {
    lib.get("/events/" + this.state.id, this)
  },

  getData: function(resp) {
    lib.data.bookings = _.keyBy(resp, "id");
    this.setState({bookings: resp})
  }
});
