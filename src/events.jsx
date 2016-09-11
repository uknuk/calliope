var React = require('react'),
    Link = require('react-router').Link,
    lib = require('./lib.jsx'),
    Table = require('./table.jsx'),
    Alerts = require('./alerts.jsx'),
    Booker = require('./booker.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  getInitialState: function() {
    return {
      admin: _.includes(this.props.route.path, 'admin'),
      loading: false,
      alerts: {},
      events: [],
      name: null
    }
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
    )
  },

  renderUser: function() {
    return (
      <div className="col-sm-4">
        <h4>Föreställningar:</h4>
        <Table body={this.getRows()} style="borderless"/>
        <Booker/>
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
	          <button type="submit" className="btn btn-primary" onClick={this.add}>Add</button>
          </div>
        </form>
        <p></p>
        <h4>Events: </h4>
        { _.isEmpty(this.state.events) ? null :
          <Table head={['Time', 'Free', 'Normal', 'Reduced', 'Revenue']}
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
        txt = "Ledig";
      }
      else if (event.free > 0) {
        mode = "warning";
        txt = event.free + " platser kvar";
      }
      else {
        mode = "danger";
        txt = "Slutsåld";
      }

      return [
        {
          val: (
            <button className={"btn btn-lg btn-" + mode} data-toggle="modal"
            data-target="#booker" data-id={event.id} data-free={event.free} >
            {new Date(event.time).toLocaleString('de')}
          </button>
          ),
        },
        txt
      ];
    });
  },


  getAdminRows: function() {
    return _.map(this.state.events, function(event) {
      return [
        new Date(event.time).toLocaleString('de'),
        event.free,
        event.normal || 0,
        event.reduced || 0,
        event.revenue || 0
      ];
    });
  },

  fetch: function() {
    lib.get("/events?details=" + this.state.admin, this);
  },

  add: function(e) {
    e.preventDefault();
    lib.save("/events", "post", {
      time: this.refs.date.value + 'T' + this.refs.time.value
    }, this);
  },

  onSaved: function() {
    this.fetch();
  },

  getData: function(resp) {
    this.setState({
      name: resp.name,
      events: resp.events
    });
  }
  
});
