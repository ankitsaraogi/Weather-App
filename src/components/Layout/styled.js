import styled from 'styled-components';

export const LayoutContainer = styled.div.attrs({
    backgroundColor: props => (props.css && props.css.backgroundColor) || "none",
    paddingLeft : props => (props.css && props.css.paddingLeft) || "25px",
    margin : props => (props.css && props.css.margin) || "10px",
    marginTop : props => (props.css && props.css.marginTop) || "0px",
    padding : props => (props.css && props.css.padding) || "20px 25px",
    minHeight: props => (props.css && props.css.minHeight) || "auto",
    position: props => (props.css && props.css.position) || "relative",
    right: props => (props.css && props.css.right) || "auto",
    height: props => (props.css && props.css.height) || "auto",
    })
    `
    background-color: ${props => props.backgroundColor};
    clear: both;
    overflow: auto;
    padding: ${props => props.padding};
    margin:  ${props => props.margin};
    padding-left: ${props => props.paddingLeft};
    position: ${props => props.position};;
    margin-top: ${props => props.marginTop};
    min-height: ${props => props.minHeight};
    right: ${props => props.right};
    height: ${props => props.height};
`;

export const Title = styled.div.attrs({
	background: props => (props.css && props.css.background) || "none",
    backgroundPosition : props => (props.css && props.css["backgroundPosition"]) || 0,
    padding : props => (props.css && props.css.background) ? "0px 30px" : 0,
    color: props => (props.css && props.css.color) || "#485164",
    fontSize: props => (props.css && props.css.fontSize) || "19px",
})`
	font-size: 20px;
    color: #6B788D;
    padding: ${props => props.padding};
    height: 25px;
    margin-bottom: 5px;
    background-position: ${props => props.backgroundPosition};
    font-size: ${props => props.fontSize};
    color: ${props => props.color};
    background: ${props => props.background};
`;

export const TitleMainContainer = styled.div.attrs({
    border : props => (props.css && props.css.border) || "none",
    borderBottom : props => (props.css && props.css.borderBottom) || "none",
    padding: props => (props.css && props.css.padding) || "0",
})`
    overflow: auto;
    clear: both;
    border: ${props => props.border};
    border-bottom: ${props => props.borderBottom};
    padding : ${props => props.padding};
    
`;

export const DropdownContainer =  styled.div`
    top: 20px;
    right: 135px;
    width: 135px;
    position: absolute;
    margin-right: 20px;
    padding-left: 20px;
    border-right: 1px solid;
`;

export const Link = styled.div`
    float: right;
    clear: both;
    overflow: auto;
`;

export const Actions = styled.div.attrs({
	padding: props => (props.type && props.type === "buttons") ? "10px 0 20px" : "0"
})`
    padding: ${props => props.padding};
    clear: both;
    overflow:auto;
`;

export const BackButton = styled.div`
    display: inline-block;
    float: left;
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid;
`;

export const SearchContainer = styled.div`
    float : right;
    padding: 10px;
`;

export const TitleContainer = styled.div`
    padding: 10px;
    width: 50%;
    float: left;
`;

export const BackMainContainer = styled.div`
    padding-top: 5px;
`;

export const ComponentContainer = styled.div`
    clear: both;
    overflow: auto;
    min-height: 40px;
`;
