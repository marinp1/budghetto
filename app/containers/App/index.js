/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import withProgressBar from 'components/ProgressBar';

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Budghetto"
        defaultTitle="Budghetto"
        meta={[
          { name: 'description', content: 'Bestest budget app the world has ever seen' },
        ]}
      />
      {React.Children.toArray(props.children)}
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);
