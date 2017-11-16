import styled from 'styled-components';

export const Container = styled.span.attrs({
    borderRight: props => (props.css && props.css.borderRight) || "none",
})`
    
    border-right: ${props => props.borderRight};
`;