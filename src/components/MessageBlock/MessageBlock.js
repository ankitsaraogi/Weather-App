import React, { Component } from 'react'
import { Message, Icon } from 'semantic-ui-react'

class MessageBlock extends Component {
  constructor(props){
      super(props);
      this.state = { visible: true };
      this.handleDismiss = this.handleDismiss.bind(this);
  }

  componentWillMount(){
    const messageType = { error: { icon: "error"}, success: { icon: "checkmark"}, info: {icon: "info circle notify"}, warning: { icon: "warning sign outline"}};
    this.icon = messageType[this.props.type].icon;
  }

  componentDidMount() {
    var self = this;
    
    if (this.props.autoClose) {
      setTimeout(function() {
        self.handleDismiss();
      }, this.props.autoClose);
    }
  }

  componentWillReceiveProps() {
    const messageType = { error: { icon: "error"}, success: { icon: "checkmark"}, info: {icon: "info circle notify"}, warning: { icon: "warning sign outline"}};
    this.icon = messageType[this.props.type].icon;
  }

  handleDismiss() {
    this.setState({ visible: false });
  }

  render() {
    var props = {
          icon: true,
          style: this.props.style,
          className: this.props.className
        };
    
    if (!this.props.noDismiss) {
      props.onDismiss = this.handleDismiss;
    }
    
    if (this.state.visible) {
      return (
        <Message {...props}>
          <Icon 
            className={this.icon} 
            size="large"
          />
          <Message.Content>{this.props.children}</Message.Content>
        </Message>
      )
    }
    else {
      return null;
    }
  }
}

export default MessageBlock;

