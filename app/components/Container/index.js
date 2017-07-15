import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: (props => props.row ? 'row' : column);
`;

export default Container;
