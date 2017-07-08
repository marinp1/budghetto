/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <article>
        <Helmet
          title="Home"
          meta={[
            { name: 'description', content: 'Bestest budget app the world has ever seen' },
          ]}
        />
        <div>
          <FormattedMessage {...messages.welcome} />
        </div>
      </article>
    );
  }
}

export default HomePage;
