import React from 'react';
import { debounce } from 'lodash';

// Since we're hitting very noticeable performance issues when there are
// tons of input fields in the DOM, here's a bit of a hacky workaround.

// Note that this component is stateful, though we can safely throw out
// its state whenever.

// (Adapted from https://github.com/erikras/redux-form/issues/529#issuecomment-172653330
// and https://github.com/erikras/redux-form/issues/529#issuecomment-191261190 )

const DEBOUNCE_TIME = 400;

class FastInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      onChangeInternal: props.onChange,
      onChange: this.wrapOnChange(props.onChange)
    };
  }

  wrapOnChange = (onChange) => {
    const debouncedOnChange = debounce(onChange, DEBOUNCE_TIME);
    return (e) => {
      this.setState({value: e.target.value});

      // We need to either clone or persist the event to work around React's event pooling.
      // (See https://facebook.github.io/react/docs/events.html#event-pooling )
      const clonedEvent = { ...e };
      debouncedOnChange(clonedEvent);
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value});
    }

    if(nextProps.onChange !== this.state.onChangeInternal) {
      this.setState({
        onChangeInternal: nextProps.onChange,
        onChange: this.wrapOnChange(nextProps.onChange)
      });
    }
  }

  render() {
    const props = {
      ...this.props,
      onChange: this.state.onChange,
      value: this.state.value
    };
    return (
      <input {...props} />
    );
  }
}

export default FastInput;
