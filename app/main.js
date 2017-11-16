import React from "react";
import * as Style from './styled/styled';

const Main = ({ children }) => {
    return (
      <div> 
        <Style.Header id="root-header">
            Weather Application
        </Style.Header>
        <Style.MainContainer>
          { children }
        </Style.MainContainer>
      </div>
    );
};

export default Main;
