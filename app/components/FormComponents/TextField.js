import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TEXT_FONT } from '../../styleConstants';

const Wrapper = styled.div`
  font-family: ${TEXT_FONT};
  margin: 8px;
`;

const Label = styled.p`
  margin: 0;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #AAA;
  border-radius: 4px;
  padding: 2px 4px;
  height: 34px;
  letter-spacing: 1px;
  margin-top: 4px;
`;

const Error = styled.p`
  color: red;
  font-style: italic;
  margin: 4px 0;
  font-size: 14px;
  text-align: left;
`;

const TextField = (props) => {
  const { input, label, placeholder, type, meta } = props;
  const { error, dirty } = meta;
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input
        onChange={(event) => input.onChange(event.target.value)}
        value={input.value}
        {...input}
        placeholder={placeholder}
        type={type}
      />
      { error && dirty ? <Error>{error}</Error> : null }
    </Wrapper>
  );
};

TextField.propTypes = {
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
};

TextField.defaultProps = {
  label: '',
  placeholder: '',
  type: 'text',
};

export default TextField;
