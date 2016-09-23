var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery');


module.exports = React.createClass({
  propTypes: {
    placement: React.PropTypes.string,
    children: React.PropTypes.string
  },
  componentDidMount: function () {
    $(ReactDOM.findDOMNode(this)).popover();
  },
  componentDidUpdate: function () {
    $(ReactDOM.findDOMNode(this)).popover();
  },
  render : function() {
    return (
      <span className="glyphicon glyphicon-zoom-in"
            data-toggle="popover" data-trigger="hover focus"
            data-placement={this.props.placement} data-html="true"
            data-container="body"
            data-content={this.props.children}>
      </span>
    );
  }
});
