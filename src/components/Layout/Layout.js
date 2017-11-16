var React = require('react');
var PropTypes = require('prop-types');
import * as LayoutStyle from './styled.js';
import * as Utils from '../components-utils.js';
import { Link } from "react-router-dom";
import { Icon } from 'semantic-ui-react';
import Search from '../../containers/SearchContainer/SearchContainer';

class Layout extends React.Component {
    constructor(props) {
        super(props);

        let { layoutProperties, containerCss, titleCss } = props;
        let { title, backButton, containers, search, dependencies } = layoutProperties;
        this.state = {
            title,
            backButton,
            containers,
            search,
            dependencies,
            containerCss,
            titleCss
        };

        this.renderTitleFromRenderer = this.renderTitleFromRenderer.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderBackButton = this.renderBackButton.bind(this);
        this.renderSearch = this.renderSearch.bind(this);
    }

    renderBackButton() {
        return (
          <div>
            {
                (
                    this.state.backButton !== undefined 
                    ? (
                      <LayoutStyle.BackMainContainer>
                        <Link to={this.state.backButton.to}>
                          <LayoutStyle.BackButton>
                            <Icon className="icon arrow return left large" />
                          </LayoutStyle.BackButton>
                        </Link>
                      </LayoutStyle.BackMainContainer>
                    )
                    : null
                )
            }
          </div>
        );
    }

    renderTitleFromRenderer() {
        let titleDom = this.state.title.renderer ? (this.state.title.renderer()) :  (<LayoutStyle.Title>{this.state.title.label}</LayoutStyle.Title>)
        return (
          <div>
            {titleDom}
          </div>
        );
    }

    renderTitle() {
        return (
          <div>
            {
                typeof(this.state.title) !== "object" ? (
                  <LayoutStyle.Title >{this.state.title}</LayoutStyle.Title>
                ) : (
                  <div>
                    {this.renderTitleFromRenderer()}
                  </div>
                )
            }
          </div>
        )
    }

    renderSearch() {
        if (this.state.search) {
            return (
              <LayoutStyle.SearchContainer>
                <Search properties={this.state.search} />
              </LayoutStyle.SearchContainer>
            );
        }

        return (
          <LayoutStyle.SearchContainer />
        );
    }

    setComponentHeight(height) {
        this.componentDom.style = this.componentDom.style || {};

        if (this.titleDom) {
            let titleDomHeight = this.titleDom.getBoundingClientRect().height;
            height -= titleDomHeight;
        }

        if (this.actionDom) {
            let actionDomHeight = this.actionDom.getBoundingClientRect().height;
            height -= actionDomHeight;
        }
        this.componentDom.style.height = height + "px";
    }

    render() {
        let self = this;
        let domNextToTitle = this.renderSearch();
        let { ...rest } = this.state.titleCss;
        return (
          <LayoutStyle.LayoutContainer css={this.state.containerCss}>
            {
                (
                    this.state.title !== '' 
                    ? (
                      <LayoutStyle.TitleMainContainer 
                        css={{ ...rest }} 
                        innerRef={(dom) => self.titleDom = dom}
                      >
                        <LayoutStyle.TitleContainer>
                          { this.renderBackButton() }
                          { this.renderTitle() }
                        </LayoutStyle.TitleContainer>
                        { domNextToTitle }
                      </LayoutStyle.TitleMainContainer>
                    )
                    : null
                )
            }
            {
                this.state.containers.map(function(layoutProps, index){
                    let key = layoutProps.key;
                    switch (key) {
                        case "actions" : 
                            return (
                              <LayoutStyle.Actions 
                                innerRef={(dom) => self.actionDom = dom} 
                                key={index}
                                type={layoutProps.properties.type}
                              >
                                { Utils.getActionType(layoutProps.properties) }
                              </LayoutStyle.Actions>
                            ); 
                        
                        case "components" :
                            return (
                              <LayoutStyle.ComponentContainer 
                                innerRef={(dom) => self.componentDom = dom}
                                key={index} 
                              >
                                { Utils.getComponentType(layoutProps.properties, domNextToTitle) }
                              </LayoutStyle.ComponentContainer>
                            ); 
                            
                        default:
                            return <div key={index} />;                
                    }
                })
            }
          </LayoutStyle.LayoutContainer>
        )
    }
}

Layout.propTypes = {
    /** properties for Layout */
    layoutProperties: PropTypes.shape({
        title: PropTypes.string,
        backButton: PropTypes.bool,
        properties: PropTypes.object,
        search: PropTypes.bool,
        dependencies: PropTypes.object
    }).isRequired,
    containerCss: PropTypes.object,
    titleCss: PropTypes.object
};

export default Layout;
