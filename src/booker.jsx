var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    $ = require('jquery'),
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  labels: {
    name: 'Namn',
    email: 'E-post',
    phone: 'Telefon'
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
            </div>

            <div className="modal-body">
              { this.renderAlerts() }
              <form className="form-horizontal">
                {this.input('name', 'text')}
                {this.input('email', 'email')}
                {this.input('phone', 'tel')}
                <legend><h4>Platser</h4></legend>
                {this.number('normal', "Normal " + lib.data.price, 1)}
                {this.number('reduced', "Rabatt (studerande, pensionär) " + lib.data.reduced, 1)}
                {this.number('group', "Group (min 10) " + lib.data.reduced, 10)}
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Avbryt</button>
              <button type="button" className="btn btn-primary" onClick={this.save}
                      disabled={this.state.saved}>Spara
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  },
 
  input: function(name, type) {
    return (
      <div className="form-group required">
        <label forHtml={name} className="control-label col-sm-4">{this.labels[name] + ':'}</label>
        <div className="col-sm-6">
          <input type={type} className="form-control" id={name} ref={name} name={name} />
        </div>
      </div>
    );
  },

  number: function(name, label, min) {
    return (
      <div className="form-group">
        <label forHtml={name} className="control-label col-sm-4">{label}</label>
        <div className="col-sm-2">
          <input type="number" className="form-control" id={name} ref={name} name={name} min={min} />
        </div>
      </div>
    );
  },

  save: function(e) {
    var pass = true,
        data = {
          event_id: this.state.id,
          created_at: (new Date()).toISOString()
        };

    e.preventDefault();

    _.each(['name','email','phone'], _.bind(function(field) {
      if (!pass)
        return;

      if (!this.refs[field].value) {
        this.setAlert('warning', this.labels[field] + " borde fyllas");
        pass = false;
      }
      else
        data[field] = this.refs[field].value;
    }, this));

    if (!pass)
      return;

    _.each(['normal', 'reduced', 'group'],  _.bind(function(field) {
      data[field] = this.refs[field].value || 0;
    }, this));

    data.reduced += data.group;
    delete data.group;

    if (data.normal + data.reduced == 0)
      this.setAlert('warning', "Inga platser reserverade!");
    else
      lib.save("/events/book", 'post', data, this);
  },

  onSaved: function() {
    this.setState({saved: true});
    this.setAlert("success", "Beställningen mottagen");
  }

});
