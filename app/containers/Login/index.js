/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import H1 from 'components/H1';
import LoginForm from './LoginForm';
import { MAIN_COLOR } from '../../styleConstants';
import { login } from '../App/actions';

const Wrapper = styled.div`
  background-color: ${MAIN_COLOR};
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Wrapper>
        <Helmet
          title="Login"
          meta={[
            { name: 'description', content: 'Login page of Budghetto' },
          ]}
        />
        <H1>Budghetto</H1>
        <LoginForm onSubmit={this.props.login} />
      </Wrapper>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  login: (values) => dispatch(login(values.get('username'), values.get('password'))),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
