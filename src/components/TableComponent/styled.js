import styled from 'styled-components';

export const TableTitle = styled.div.attrs({
	background: props => (props.css && props.css.background) || "none",
	backgroundPosition : props => (props.css && props.css["backgroundPosition"]) || 0
})`
	font-size: 2vmin;
  color: #485164;
  padding: 0px 30px;
  height: 25px;
  margin-bottom: 5px;
  background-position: ${props => props.backgroundPosition};
  background: ${props => props.background};
`;

export const TableContainerDiv = styled.div.attrs({
	key: props => props.id
})`
	border: 1px solid #BABABA;
	padding: 1em;
`;

export const TableNoData = styled.div`
  padding: 5px;
  font-size: 2vmin;
`;
