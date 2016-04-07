import React, { Component } from 'react';
// import Draggable from 'react-draggable';

//FIXME: should wrap a scrollable component and attach the event listener to its
//scroll event, rather than the document.
//This is not currently connected to Redux, either.

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  componentDidMount() {
    // Binding creates a new function! We need to stash a reference in the state
    // so that we can remove the handlers when we unmount the component.
    const scrollHandler = this.handleScroll.bind(this);
    const resizeHandler = this.handleResize.bind(this);
    this.setState({
      scrollHandler,
      resizeHandler
    });
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', resizeHandler);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.state.scrollHandler);
    window.removeEventListener('resize', this.state.resizeHandler);
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  handleScroll() {
    this.setState({
      x: window.scrollX,
      y: window.scrollY
    });
  }
  render() {
    return (
      <div style={{
        backgroundColor: '#999',
        position: 'fixed',
        right: '0px',
        bottom: '0px'
      }}>
        ({this.state.x}, {this.state.y})<br />
        ({this.state.width}, {this.state.height})
      </div>
    );
  }
}
