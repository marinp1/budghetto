import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TextField from '../../components/FormComponents/TextField';
import { SHADOW_COLOR, BUTTON_RED, BUTTON_RED_HOVER } from '../../styleConstants';
import messages from './messages';
import Link from '../../components/Button/Link';
import Button from '../../components/Button';
import Container from '../../components/Container';
import validate from './validate';

const Cancel = styled(Link)`
  background-color: ${BUTTON_RED};

  &:hover {
    background-color: ${BUTTON_RED_HOVER};
  }
`;

const FormContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0 35%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 5px ${SHADOW_COLOR};
  margin-top: 16px;
`;

const ButtonContainer = styled(Container)`
  justify-content: space-around;
`;

const LoginForm = (props) => {
  const { handleSubmit, pristine } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        <Field
          name="username"
          component={TextField}
          type="text"
          label="Username"
          placeholder="example@budghetto.space"
        />
        <Field
          name="password"
          component={TextField}
          type="password"
          label="Password"
          placeholder="password"
        />
        <ButtonContainer row>
          <div>
            <Button type="submit" disabled={pristine}><FormattedMessage {...messages.login} /></Button>
          </div>
          <div>
            <Cancel to="/"><FormattedMessage {...messages.back} /></Cancel>
          </div>
        </ButtonContainer>
      </FormContainer>
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'login', validate })(LoginForm);
