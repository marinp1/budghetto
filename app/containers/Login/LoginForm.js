import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TextField from '../../components/FormComponents/TextField';
import { SHADOW_COLOR } from '../../styleConstants';
import messages from './messages';

const FormContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: col;
  margin: 0 25%;
  border-radius: 8px;
  box-shadow: 0 2px 5px ${SHADOW_COLOR};
`;

const LoginForm = (props) => {
  const { handleSubmit, pristine } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        <div>
          <Field
            name="username"
            component={TextField}
            type="text"
            placeholder="First Name"
          />
        </div>
        <div>
          <button type="submit" disabled={pristine}><FormattedMessage {...messages.login} /></button>
        </div>
      </FormContainer>
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'login' })(LoginForm);
