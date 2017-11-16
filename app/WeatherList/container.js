var React = require('react');
import * as Style from '../styled/styled';
import Layout from '../../src/components/Layout/Layout';
import FilterLayout from './filter';
import TableLayout from './weatherTable';

class WeatherFilter extends React.Component {
  constructor(props) {
    super(props);

    this.node = undefined;
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
  }

  componentDidMount() {
      window.addEventListener("scroll", this.handleWindowScroll);
  }

  componentWillUnmount() {
      window.removeEventListener("scroll", this.handleWindowScroll);
  }

  handleWindowScroll(e) {
      var scrOfY = 0;
      if ( typeof( window.pageYOffset ) === 'number' ) {
        //Netscape compliant
        scrOfY = window.pageYOffset;
      } else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
      } 
      
      let ele = this.node;
      let bodyHeight = document.body.getBoundingClientRect().height;
      ele.style = ele.style || {};
      ele.style.bottom = 0;
      ele.style.right = 0;
      if (scrOfY === 0) {
          ele.style.top = 140 + "px";
          ele.style.height = (bodyHeight - 140) + "px";
      }
      else if (scrOfY > 1 && scrOfY <= 80) {
          ele.style.top = (140 - scrOfY) + "px";
          ele.style.height = (bodyHeight - scrOfY) + "px";
      }
      else {
          ele.style.top = 60 + "px";
          ele.style.height = (bodyHeight - 60) + "px";
      }
  }

  render() {
    return (
      <Style.FilterTableContainer>
        <Style.FilterMainContainer innerRef={(node) => this.node = node}>
          <Layout 
            containerCss={{ backgroundColor : "#F5F7FB", marginTop: "0px", padding: "15px 25px 15px",  margin: "0px", minHeight: "490px", height: "100%" }}
            layoutProperties={FilterLayout} 
          />       
        </Style.FilterMainContainer>
        <Style.TableMainContainer>
          <Layout 
            containerCss={{ backgroundColor : "#FFF", marginTop: "0px", margin: "0px", padding: "0px", paddingLeft: "25px" }}
            layoutProperties={TableLayout}
          />       
        </Style.TableMainContainer>
      </Style.FilterTableContainer>
    );
  }
};
    
export default WeatherFilter;
