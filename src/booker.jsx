var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    $ = require('jquery'),
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx');

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      saved: false,
      alerts: {},
      id: null,
      free: 0
    }
  },
  
  componentDidMount: function () {
    $(ReactDOM.findDOMNode(this)).on('show.bs.modal', _.bind(function(event) {
      var target = $(ReactDOM.findDOMNode(event.relatedTarget));
      this.setState({
        id: target.data("id"),
        free: target.data("free")
      });
    }, this));
  },


  render: function() {
    return (
      <div id="booker" className="modal fade" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            

          

                <form className="form-horizontal col-sm-12">
                  {this.input('name', 'Namnet', 'text')}
                  {this.input('email', 'Email', 'email')}
                  {this.input('phone', 'Telefon', 'tel')}
                  {this.input('normal', "Platser för normal pris", 'number')}
                  {this.input('reduced', "Platser för rabatt pris: (barn, pensionär)", 'number')}
                </form>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
            </div>

          </div>
        </div>
      </div>
    );
  },

  input: function(name, label, type) {
    return (
      <div className="form-group">
        <label forHtml={name} className="control-label col-sm-4">{label + ':'}</label>
        <div className="col-sm-6">
          <input type={type} className="form-control" id={name} ref={name} name={name}
                 min="1" step="1" required />
        </div>
      </div>
    );
  },


});
