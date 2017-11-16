var React = require('react');
var PropTypes = require('prop-types');
import { Label, Icon, Loader } from 'semantic-ui-react';
import * as Style from './styled';
import * as api from "../../core/http-client/api";

class LabelComponent extends React.Component {
    constructor(props) {
        super(props);

        let { label, icon, addSeparator, context, url, renderer, options } = props.properties;
        this.state = {
            label, icon, addSeparator, context, url, renderer, refresh: false, data: undefined, options
        }
    }

    componentWillMount() {
        if (this.state.url)
            this.setState(function() { return { refresh: true }; });
    }

    componentDidMount() {
        if (! this.state.url)  
            return;

        api.get(this.state.url, this.state.context)
            .then(function (repos) {
            let data = repos.data;
            let label = this.state.renderer ? this.state.renderer(data) : data;
            
            this.setState(function () {
                return {
                    label: label,
                    refresh: false,
                    data: data
                };
            });
        }.bind(this))
    }

    render() {
        let { label, icon, addSeparator, renderer, context } = this.state;
        if (this.state.refresh) {
            return (
              <div>
                <Loader 
                    active 
                    inline='centered' 
                    size="small" 
                />
              </div>
            );
        }

        label = renderer ? ( this.state.data ? label : renderer(context, label)) : label;
        
        let css = {
            borderRight: addSeparator ? "1px solid #D8D8D8" : null
        };

        if (! label) { return null; }

        return (
          <Style.Container 
            className="rdx-label"
            css={css} 
          >
            <Label 
                {...this.state.options}
            >
              { (icon ? <Icon className={icon} /> : null) }
              {label}
            </Label>
          </Style.Container>
        );
    }
}

LabelComponent.propTypes = {
    /** properties for Label */
    properties: PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        addSeparator: PropTypes.bool,
        context: PropTypes.object,
        url: PropTypes.string,
        renderer: PropTypes.func,
        options: PropTypes.object
    }).isRequired
};

module.exports = LabelComponent;
