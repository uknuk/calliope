var React = require('react'),
    Link = require('react-router').Link,
    lib = require('./lib.js'),
    Table = require('./table.jsx'),
    Alerts = require('./alerts.jsx'),
    Booker = require('./booker.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      admin: _.includes(this.props.route.path, 'admin'),
      loading: false,
      alerts: {},
      events: [],
      name: null
    };
  },

  componentWillMount: function() {
    this.fetch();
  },

  render: function() {
    if (this.state.loading)
      return (<div> Loading ... </div>);
    return (
      <div className="container-fluid">
        { this.renderAlerts() }
        <h2><i>{this.state.name}</i></h2>
        <p></p>
        {this.state.admin? this.renderAdmin() : this.renderUser()}
      </div>
    );
  },

  renderUser: function() {
    return (
      <div className="col-sm-4">
        <h4>{lib.tr("performances")}</h4>
        <Table body={this.getRows()} style="table-borderless"/>
        <Booker onClose={this.close}/>
      </div>
    );
  },

  renderAdmin: function() {
    return (
      <div>
        <h4>New event </h4>
        <form className="form-inline">
          <div className="form-group">
            <label htmlFor="date">Date:&nbsp;</label>
            <input type="date" className="form-control" ref="date" required/>
            &nbsp;
            <label htmlFor="time">Time:&nbsp;</label>
            <input type="time" className="form-control" ref="time" required/>
            &nbsp;
            <button className="btn btn-primary" onClick={this.add}>Add</button>
          </div>
        </form>
        <p></p>
        <h4>Events: </h4>
        { _.isEmpty(this.state.events) ? null :
          <Table head={['Time', 'Free', 'Normal', 'Reduced', 'Group', 'Revenue', '']}
                 body={this.getAdminRows()}
          />
        }
      </div>
    );
  },

  getRows: function() {
    return _.map(this.state.events, function(event) {
      var mode, txt;

      if (event.free > 10) {
        mode = "success";
        txt = lib.tr("free");
      }
      else if (event.free > 0) {
        mode = "warning";
        txt = event.free + lib.tr("remains");
      }
      else {
        mode = "danger";
        txt = lib.tr("soldout");
      }

      return [
        {
          val: (
            <button className={"btn btn-lg btn-" + mode} data-toggle="modal"
                    data-target="#booker" data-event={event.id} >
              {lib.showDate(new Date(event.time))}
            </button>
          ),
        },
        {
          val: (<span className="large-text">{txt}</span>)
        }
      ];
    });
  },


  getAdminRows: function() {
    return _.map(this.state.events, _.bind(function(ev) {
      return [
        lib.showDate(new Date(ev.time)),
        ev.free,
        ev.normal || 0,
        ev.reduced || 0,
        ev.troop || 0,
        (ev.normal*lib.data.price + (ev.reduced + ev.troop)*lib.data.reduced).toFixed(2),
        {
          val: (
            <div className="btn-toolbar">
              <Link className="btn btn-xs btn-info" to={"/ui/admin/events/" + ev.id} title="View detail">
                <span className="glyphicon glyphicon-zoom-in"></span>
              </Link>
              <button type="button" className="btn btn-xs btn-danger" onClick={this.disable.bind(null, ev.id)}>
                <span className="glyphicon glyphicon-trash"></span>
              </button>
            </div>
          )
        }
      ];
    }, this));
  },

  fetch: function() {
    lib.get("/events?details=" + this.state.admin, this);
  },

  add: function() {
    lib.save("/events", "post", {
      time: lib.setDate(this.refs.date.value + ' ' + this.refs.time.value)
    }, this);
  },

  onSaved: function() {
    this.fetch();
  },

  close: function() {
    this.fetch();
  },

  getData: function(resp) {
    lib.data.price = resp.play.price;
    lib.data.reduced = (resp.play.price*(1 - resp.play.discount)).toFixed(2);
    lib.data.events = _.keyBy(resp.events, "id");

    this.setState({
      name: resp.play.name,
      events: resp.events
    });
  },

  disable: function(id) {
   lib.save("/events/" + id, "put", {}, this);
  }

});
