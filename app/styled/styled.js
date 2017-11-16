import styled from 'styled-components';

export const Header = styled.div`
    padding: 20px 24px;
    font-size: 20px;
    color: #FFF;
    font-weight: 600;
    line-height: 20px;
    position: fixed;
    top:0;
    right:0;
    height: 60px;
    background-color: #485164;
    width: 100%;
    z-index: 100;
`;

export const MainContainer = styled.div`
    padding-top: 60px;
    width: 100%;
    height: 100%;
`;

export const FilterTableContainer = styled.div`
    clear: both;
    overflow: auto;
    width: 100%;
`;

export const FilterMainContainer = styled.div`
    width: 18%;
    float : left;
    position: fixed;
    top: 140px;
    left: 0;
`;


export const TableMainContainer = styled.div`
    width: 82%;
    float: left;
    padding: 25px;
    position: relative;
    left:230px;
`;

/***** TIMELINE STYLES */

export const TimelineBackButton = styled.div`
    display: inline-block;
    float: left;
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid;
`;

export const TimelineBackButtonContainer = styled.div`
    position: absolute;
    top: 38%;
    left: 3%;
`;

export const TimelineTitleContainer = styled.div`
    background-color: #FFF;
    height: 80px;
    position: relative;
    clear: both;
    padding-top: 20px;
    padding-bottom: 15px;
    padding-left: 10px;
    border-bottom: 1px solid #BABABA;
`;

export const TimelineCity = styled.span`
    margin-left: 20px;
    line-height: 30px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    font-family: CitrixSans;
`;

export const TimelineUseridContainer = styled.div`
    position: absolute;
    left: 9%;
    top: 32%;
`;

export const ScoreTooltip = styled.div`
    position: absolute;
    top: 22px;
    left: 0px;
    z-index: 9;
`;

export const TooltipContainer = styled.div`
    width: 250px;
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 2px;
    margin: 15px;
    color: #fff;
`;

export const TooltipTitle = styled.div`
    font-size: 12px;
    padding-bottom: 10px;
`;

export const TTSpan = styled.span`
    float: right;
    opacity: .6;
    font-size: 11px;
`;

export const RiskIndicator = styled.div`

`;

export const TTSubtitle = styled.div`
    font-size: 12px;
    padding-bottom: 10px;
`;

export const TTSubtitleSpan = styled.span`
    float: right;
    font-size: 13px;
`;

export const TTList = styled.div`
    opacity: .6;
    font-size: 11px;
    padding: 5px;
    padding-bottom: 10px;
`;

export const TTSpanCount = styled.span`
    float : right;
`;

export const Para = styled.div`
    opacity: .6;
    font-size: 11px;
`;

export const TimelineContentTableContainer = styled.div`
    width: 100%;
`;

export const TimelineContentTitleContainer = styled.div`
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 19px;
    color: #485164;
`;

export const TimelineContentDescriptionContainer = styled.div`
    margin-bottom: 10px;
`;

export const WrapText = styled.div.attrs({
    width: props => (props.width) || "150px"
    })`
    width: ${props => props.width};
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const TimelineContentChartContainer = styled.div`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export const TimelineContentChartTitle = styled.div`
    font-size: 16px;
    color: #485164;
    margin-bottom: 10px;
`;

