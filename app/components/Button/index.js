import styled from 'styled-components';
import { BUTTON_BLUE, BUTTON_BLUE_HOVER, MAIN_TEXT_COLOR } from '../../styleConstants';

const CustomButton = styled.button`
  background-color: ${BUTTON_BLUE};
  color: ${MAIN_TEXT_COLOR};
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  padding: 8px;
  border-radius: 4px;
  display: inline-block;
  width: 96px;
  margin: 16px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background-color: ${BUTTON_BLUE_HOVER};
  }
`;

export default CustomButton;
