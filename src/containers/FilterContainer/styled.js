import styled from 'styled-components';

export const FilterMainCompContainer = styled.div.attrs({
    marginTop: props => (props.marginTop) || "30px",
    padding: props => (props.padding) || "0px",
})`
    width: 100%;
    margin-top:  ${props => props.marginTop};
    padding: ${props => props.padding};
`;

export const CheckboxContainer = styled.div`
    background-color: #e9ecf2;
    padding: 5px 10px;
    border-bottom: 1px solid #FFF;
`;

export const Label = styled.div.attrs({
    paddingBottom: props => (props.paddingBottom) || "20px"
})`
    padding-bottom: ${props => props.paddingBottom};
    font-size: 12px;
    font-weight: 600;
    color: #485164;
`;
