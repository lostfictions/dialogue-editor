import React, { PropTypes } from 'react';
import {DraggableCore} from 'react-draggable';

const draggableNodeStyles = {
  minWidth: '100px',
  maxWidth: '400px',
  minHeight: '100px',
  position:'absolute'
};

const DraggableNodeWrapper = ({ onDrag, x, y, children, ...props }) => (
  <DraggableCore onDrag={onDrag}
                 zIndex={100}>
     {React.cloneElement(React.Children.only(children), {
       style: {transform: 'translate(' + x + 'px,' + y + 'px)', ...draggableNodeStyles},
       ...props
     })}
  </DraggableCore>
);

DraggableNodeWrapper.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onDrag: PropTypes.func.isRequired
};

export default DraggableNodeWrapper;