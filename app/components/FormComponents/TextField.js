import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Input = styled.input`
  color: red;
`;

const TextField = (props) => {
  const { input } = props;
  return (
    <div>
      <p>Test</p>
      <Input
        onChange={(event) => input.onChange(event.target.value)}
        value={input.value}
        {...input}
      />
    </div>
  );
};

TextField.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
};

export default TextField;
