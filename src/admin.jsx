var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    _ = require('lodash'),
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx');

module.exports = React.createClass({
  mixins: [ Alerts ],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

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
        <form className="form-inline">
          <div className="form-group">
	          <label htmlFor="password">Password:&nbsp;</label>
            <input type="password" className="form-control" ref="password" required/>
	          &nbsp;
	          <button type="submit" className="btn btn-primary" onClick={this.auth}>Submit</button>
          </div>
        </form>
      </div>
    );
  },

  auth: function(e) {
    e.preventDefault();
    lib.save("/login", 'post', {
      username: 'admin',
      password: this.refs.password.value
    }, this);
  },

  onSaved: function() {
    this.context.router.push('/ui/admin/events');
  }

});
