var React = require('react'),
    ReactDOM = require('react-dom'),
    Link = require('react-router').Link,
    $ = require('jquery'),
    lib = require('./lib.jsx'),
    Alerts = require('./alerts.jsx');

module.exports = React.createClass({
  mixins: [Alerts],

  getInitialState: function() {
    return {
      saved: false,
      alerts: {},
      eventId: null,
      free: 0
    }
  },

  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.onClose);

    $(ReactDOM.findDOMNode(this)).on('show.bs.modal', _.bind(function(event) {
      var target = $(ReactDOM.findDOMNode(event.relatedTarget)),
          eventId = target.data("event"),
          bookId = target.data("booking"),
          free = lib.data.events[eventId].free;

      this.setState({
        eventId: eventId,
        free: free,
        booking: bookId ? lib.data.bookings[bookId] : {}
        // saved: false (useful for debugging)
      });
    }, this));
  },

  render: function() {
    return (
      <div id="booker" className="modal fade" tabIndex="-1">
        {this.state.eventId ? (
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
                   <div className="form-group">
                     <label className="control-label col-sm-2" forHtml="msg">{lib.tr("msg")}</label>
                     <div className="col-sm-6">
                       <textarea rows='5' cols='60' id="msg" ref="message"
                                 defaultValue={this.state.booking.message}
                       />
                     </div>
                   </div>
                   <legend><h4>Platser</h4></legend>
                   {this.number('normal', "Normal " + lib.data.price, 1)}
                   {this.number('reduced', lib.tr("reduced") + lib.data.reduced, 1)}
                   {this.number('troop', lib.tr("troop") + lib.data.group, 10)}
                 </form>
               </div>

               <div className="modal-footer">
                 <button type="button" className="btn btn-default" data-dismiss="modal">
                   {lib.tr(this.state.saved ? "close" : "cancel")}
                 </button>
                 <button type="button" className="btn btn-primary" onClick={this.save}
                         disabled={this.state.saved}>
                   {lib.tr("save")}
                 </button>
               </div>
             </div>
           </div>
         ) : null
        }
      </div>
    );
  },

  input: function(name, type) {
    var val = this.state.booking ? this.state.booking[name] : '';
    return (
      <div className="form-group required">
        <label forHtml={name} className="control-label col-sm-2">{lib.tr(name) + ':'}</label>
        <div className="col-sm-6">
          <input type={type} className="form-control" id={name} ref={name} name={name}
                 defaultValue={val}
          />
        </div>
      </div>
    );
  },

  number: function(name, label, min) {
    var val = this.state.booking ? this.state.booking[name] : '';
    return (
      <div className="form-group">
        <label forHtml={name} className="control-label col-sm-4">{label}</label>
        <div className="col-sm-2">
          <input type="number" className="form-control" id={name} ref={name} name={name}
                 min={min} defaultValue={val} />
        </div>
      </div>
    );
  },

  save: function(e) {
    var total,
        pass = true,
        free = this.state.free,
        booking = this.state.booking,
        isNew = _.isEmpty(booking),
        data = {
          event_id: this.state.eventId,
          created_at: lib.setDate(new Date())
        };

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

    data.message = this.refs.message.value;

    _.each(['normal', 'reduced', 'troop'],  _.bind(function(field) {
      data[field] = parseInt(this.refs[field].value || 0);
    }, this));

    if (data.troop > 0 && data.troop < 10) {
      this.setAlert('warning', lib.tr("mingroup"));
      return;
    }

    total = data.normal + data.reduced + data.troop;

    if (!isNew)
      free += booking.normal + booking.reduced;

    if (total == 0)
      this.setAlert('warning', lib.tr("noplaces"));
    else if (total > free)
      this.setAlert('warning', lib.tr("over"));
    else {
      if (isNew)
        lib.save("/bookings", 'post', data, this);
      else
        lib.save("/bookings/" + booking.id, "put", data, this);
    }
  },

  onSaved: function() {
    this.setState({saved: true});
    this.setAlert("success", lib.tr("reserved"));
  }

});
