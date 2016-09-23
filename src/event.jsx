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
    }
  },

  componentWillMount: function() {
    if (!lib.data.price) {
      this.context.router.push('/ui/admin/events');
      return;
    }
    
    this.fetch();
  },

  render: function() {
    var date = lib.data.events ?
               lib.showDate(new Date(lib.data.events[this.state.id].time)) : '',
        headers =
    ["Name", "Email", "Phone", "Normal", "Reduced", "Payment", "Message", "Booked", ''];

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
    return _.map(this.state.bookings, _.bind(function(entry) {
      return [
        entry.name,
        entry.email,
        entry.phone,
        entry.normal,
        entry.reduced,
        entry.normal*lib.data.price + entry.reduced*lib.data.reduced + "€",
        {
          val: _.isEmpty(entry.message) ? null :
          (<Popover placement="left">{entry.message}</Popover>)
        },
        lib.showDate(new Date(entry.created_at)),
        {
          val: (
            <div className="btn-toolbar">
              <button type="button" className="btn btn-xs btn-success" data-toggle="modal"
                      data-target="#booker" data-event={this.state.id} data-booking={entry.id}
              >
                <span className="glyphicon glyphicon-edit"></span>
              </button>
            <button type="button" className="btn btn-xs btn-danger" onClick={this.delete.bind(null, entry.id)}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
            </div>
          )
        }
      ];
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
