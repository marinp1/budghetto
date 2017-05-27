const React = require('react');
const render = require('react-dom');

export default class NavElem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onClick={ () => { this.props.changeView(this.props.text); this.props.hideMobileMenu(); } } className={'nav' + this.props.className }>
        { this.props.icon }
        <p>{ this.props.text }</p>
      </div>
    );
  }
}
