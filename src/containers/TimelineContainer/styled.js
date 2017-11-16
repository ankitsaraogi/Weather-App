import styled from 'styled-components';

export const TimelineContainer = styled.div`
    width: 100%;
    position: relative;
    clear: both;
`;

export const TimelineMainContainer = styled.div.attrs({
    width: props => (props.width) || "45%"
})`
    width: ${props => props.width};
    padding: 10px 0;
    float: left;
    min-height: 500px;
`;

export const TimelineContainerNoData = styled.div`
    padding: 20px 0;
    font-size: 14px;
`;