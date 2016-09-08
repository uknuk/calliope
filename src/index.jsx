var ReactDOM = require('react-dom'),
    React = require('react'),
    router = require('react-router'),
    $ = require('jquery'),
    Router = router.Router,
    Route = router.Route,
    Events = require('./events.jsx'),
    Event = require('./event.jsx'),
    Admin = require('./admin.jsx'),
    Booker = require('./booker.jsx'),
    AdminEvents = require('./admin_events.jsx');

$(function() {

  $.ajaxSetup({
    beforeSend: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      xhr.setRequestHeader( 'X-CSRF-Token', token );
    }
  });


  ReactDOM.render((
    <Router history={router.browserHistory} >
      <Route path="/ui/events" component={Events} />
      <Route path="/ui/events/:id/booker" component={Booker} />
      <Route path="/ui/admin" component={Admin} />
      <Route path="/ui/admin/events" component={AdminEvents} />
      <Route path="/ui/admin/events/:id" component={Event} />
    </Router>
  ), document.getElementById('app'));

});

