/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import H1 from './CustomH1';
import messages from './messages';
import Link from '../../components/Button/Link';
import Footer from '../../components/Footer';
import { MAIN_TEXT_COLOR, BUTTON_RED, BUTTON_RED_HOVER } from '../../styleConstants';

import backgroundImg from './homePageBackground.jpg';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  color: ${MAIN_TEXT_COLOR};
`;

const MainContainer = styled.div`
  background: url(${backgroundImg});
  background-size: cover;
  height: 100%;
  width: 100%;
`;

const Overlay = styled.div`
  background: radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Welcome = styled.div`
  padding-top: 20%;
`;

const Links = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const RedLink = styled(Link)`
  background-color: ${BUTTON_RED};

  &:hover {
    background-color: ${BUTTON_RED_HOVER};
  }
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Wrapper>
        <Helmet
          title="Home"
          meta={[
            { name: 'description', content: 'Bestest budget app the world has ever seen' },
          ]}
        />
        <MainContainer>
          <Overlay>
            <Welcome>
              <H1>Budghetto</H1>
              <FormattedMessage {...messages.welcome} />
            </Welcome>
            <Links>
              <Link to="login">
                <FormattedMessage {...messages.login} />
              </Link>
              <RedLink to="register" >
                <FormattedMessage {...messages.register} />
              </RedLink>
            </Links>
            <Footer />
          </Overlay>
        </MainContainer>
      </Wrapper>
    );
  }
}

export default HomePage;
