var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  getInitialState: function() {
    return {
      error: null,
      loading: false,
      alerts: {},
    }
  },

  render: function() {
    if (this.state.loading)
      return (<div> Loading ... </div>);
    return (
      <div className="container-fluid">
      { this.renderAlerts() }
      <h4>New event </h4> 
      <form className="form-inline">
      <div className="form-group">
	    <label htmlFor="date">Date:&nbsp;</label>
      <input type="date" className="form-control" ref="date" required/>
	    &nbsp;
      <label htmlFor="time">Time:&nbsp;</label>
      <input type="time" className="form-control" ref="time" required/>
      &nbsp;
	    <button type="submit" className="btn btn-primary" onClick={this.auth}>Add</button>
      </div>
        </form>
      </div>
    )
  }
});
