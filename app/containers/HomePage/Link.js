import { Link } from 'react-router';
import styled from 'styled-components';
import { BUTTON_BLUE, BUTTON_BLUE_HOVER, MAIN_TEXT_COLOR } from '../../styleConstants';

export default styled(Link)`
  background-color: ${(props) => props.color ? props.color : BUTTON_BLUE};
  color: ${MAIN_TEXT_COLOR};
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  padding: 8px;
  border-radius: 4px;
  display: inline-block;
  width: 96px;
  margin: 16px;

  &:hover {
    background-color: ${(props) => props.hoverColor ? props.hoverColor : BUTTON_BLUE_HOVER};
  }
`;
