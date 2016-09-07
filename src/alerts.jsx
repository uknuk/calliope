var React = require('react');


module.exports = {
  setAlert: function(type, message) {
    var alerts = _.clone(this.state.alerts);
    if (!alerts[type])
      alerts[type] = [];
    if (!_.includes(alerts[type], message))
      alerts[type].push(message);
    this.setState({alerts: alerts});
  },

  handleError: function(error) {
    if (error.status == 401)
      this.setUnauthorised();
    else
      this.setError('Sorry something went wrong, let us know and we fix it');
  },

  setError: function(msg) {
    this.setAlert('error', msg);
  },


  setUnauthorised: function() {
    this.setAlert(
      'warning', 'You are not authorised to access this page'
    );
  },

  clearAlerts: function(type) {
    var alerts = _.clone(this.state.alerts);
    alerts[type] = [];
    this.setState({alerts: alerts});
  },

  renderAlerts: function(width) {
    return (
      <div>
        {
           _.map(_.keys(this.state.alerts), _.bind(function(type, idx) {
             if (!_.isEmpty(this.state.alerts[type])) {
               return (<div key={idx} className={width}>{this.renderType(type)}</div>);
             }
           }, this))
        }
      </div>
    );
  },

  renderType: function(type) {
    var alertType = type == 'error' ? 'danger' : type;
    return (
      <div className={"alert alert-" + alertType + ' alert-dismissable'}>
        <button type="button" className="close" onClick={this.clearAlerts.bind(null,type)}>&times;</button>
        {
           _.map(this.state.alerts[type], function(msg, idx) {
             return <div key={idx} dangerouslySetInnerHTML={{__html: msg}} />;
           })
        }
      </div>
    );
  }
}
  
