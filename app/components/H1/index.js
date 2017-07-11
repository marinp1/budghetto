import styled from 'styled-components';
import { MAIN_TEXT_COLOR, HEADING_FONT } from '../../styleConstants';

const H1 = styled.h1`
  margin: 0;
  font-size: 32px;
  color: ${MAIN_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: ${HEADING_FONT};
`;

export default H1;
