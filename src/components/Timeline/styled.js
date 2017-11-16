import styled from 'styled-components';

export const CateogaryContainer = styled.div`
    float: left;
    position: absolute;
    border-radius: 50%;
    top: 28px;
    background: #fff;
    height: 13px;
    border: 1.5px solid #bed7ed;
    width: 13px;
    left:-6px;
`;

export const CateogaryWrapper = styled.div`
    border-color: #bed7ed;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 2px solid #8C90A4;
    padding: 4px;
`;

export const TimeContainer = styled.div`
    float: left;
    text-align: right;
    min-width: 100px;
    color: rgba(72, 81, 100, 0.75);
    width: 12.6%;
    line-height: 1;
    padding: 20px 0 19px;
    margin: 10px 0;
    font-size: 11px;
    padding-right: 22px;
    color: #6b788d;
`;

export const MeterContainer = styled.div.attrs({
    backgroundColor: props => (props.css && props.css.backgroundColor) || "none"
})`
    color: #FFF;
    padding: 5px;
    height: 30px;
    width: 70px;
    position: relative;
    background-size: contain;
    background-color: ${props => props.backgroundColor};
    float: left;
`;

export const SecurityLevel = styled.div.attrs({
    color: props => (props.css && props.css.color) || "black"
})`
    color: ${props => props.color};
    border: solid 1.5px;
    border-radius: 2px;
    border-color: ${props => props.color};
    padding: 6.5px;
    width: 10.1%;
    height: 48%;
    font-size: 9px;
    font-weight:bold;
    text-align: center;
    position: relative;
    background-size: contain;
    float: left;
    line-height: 10px;
`;

export const ScoreContainer = styled.div`
    float: left;
    border-radius: 2px;
    background-color: rgba(132, 148, 169, 0.24);
    font-weight: bold;
    text-align: center;
    color: #666b75;
    width: 11.1%;
    height: 48%;
    margin-left: 5px;
    margin-right: 9px;
    padding: 5px;
    font-size: 9px;
`;

export const ContentContainer = styled.div`
    float: left;
    padding: 2px 0;
    font-weight: 500;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    white-space: nowrap;
    max-width: 65%;
    color: #39404d;
    font-size: 15px;
    line-height: 19px;
`;

export const TimelineMainContainer = styled.div`
    position: relative;
    clear: both;
`;

export const MessageContainer = styled.div`
    position: absolute;
    right: -100px;
    top: 20px;
`;

export const ScoreMessage = styled.div`
    position: absolute;
    top: 45px;
    z-index: 9;
    left: 130px;
    width: 120px;
`;

export const CateogaryConnectorContainer = styled.div`
    position: relative;
    float: left;
    width:5%;
`;

export const ContentMainContainer = styled.div`
    float: left;
    border-left: 2px solid #bed7ed;
    width: 81%;
    height: 12.9%;
`;

export const Connector = styled.div`
    border: 1px solid #bed7ed;
    width: 55%;
    position: absolute;
    top: 33px;
    left:6px;
`;

export const ScoreChangeRenderer = styled.div`
    color: #485164;
    border: solid 1px #bed7ed;
    cursor: pointer;
    width: 90%;
    padding: 13px 0px 13px 11px;
    background: url(right.png) no-repeat right 5px center #fff;
    clear: both;
    overflow: auto;
    margin: 10px;
    margin-left: 19px;
`;

export const PeriodContainer = styled.div`
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    color: rgba(72, 81, 100, 0.75);
    background: #bed7ed;
    margin: 0 auto;
    border-radius: 2px;
    position: relative;
    text-align: center;
    width: 11.3%;
    height: 20px;
    left: 10.9%;
    padding: 4px 2px;
    line-height: 0.7142857rem;
`;

export const TimelineContent = styled.div.attrs({
    display: props => (props.visible) ? "block" : "none",
    height: props => {
        let bodyHeight = document.body.getBoundingClientRect().height;
        return (bodyHeight - 184) + "px";
    } 
})`
    float: left;
    width: 53%;
    height: ${props => props.height};
    position: fixed;
    top:140px;
    left: 47%;
    background-color: #FFF;
    display:  ${props => props.display};
    border-left: 1px solid #BABABA;
    padding-left: 10px;
    padding-top: 20px;
    padding-right: 10px;
    overflow: auto;
`;

export const ScoreContainerSpan = styled.span`
    width: 35px;
    height: 30px;
    line-height: 30px;
    float: right;
    text-align: left;
    font-size: 17px;
    position: absolute;
    top: 0;
    left: 38px;
`;