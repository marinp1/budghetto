import React from 'react';
import { FormattedMessage } from 'react-intl';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <NavBar>
          <HeaderLink to="/transactions">
            <FormattedMessage {...messages.transactions} />
          </HeaderLink>
          <HeaderLink to="/settings">
            <FormattedMessage {...messages.settings} />
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;
