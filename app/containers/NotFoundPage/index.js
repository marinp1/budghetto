/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import H1 from 'components/H1';
import messages from './messages';
import { MAIN_COLOR } from '../../styleConstants';
import Link from './Link';

const Wrapper = styled.div`
  background-color: ${MAIN_COLOR};
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 25%;
`;

export default function NotFound() {
  return (
    <Wrapper>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <Link to="/">
        <FormattedMessage {...messages.forward} />
      </Link>
    </Wrapper>
  );
}
