import React from 'react';
import { connect } from 'react-redux';
import ClipNode from '../Containers/Nodes/ClipNode';
import QuestionNode from '../Containers/Nodes/QuestionNode';
import DraggableNodeWrapper from '../Containers/Nodes/DraggableNodeWrapper';

import { nodeTypes, graphAndListViewActionTypes as commonActionTypes } from '../Constants';


export const actionTypes = {
  DRAG_NODE: 'DRAG_NODE'
};

//FIXME: this needs a bunch of updating to provide props to the nodes, since
//it's been excluded from a few refactors...

const GraphView = ({ questions, clips, lang, zoom, onDrag, onChoiceTextChanged }) => (
  <div style={{transform:`scale(${zoom},${zoom})`, transformOrigin:'center'}}>
    {questions.map(q =>
      <DraggableNodeWrapper key={q.id}
                     x={q.x}
                     y={q.y}
                     onDrag={(e, ui) => onDrag(nodeTypes.QUESTION_NODE, q.id, { x: ui.position.deltaX, y: ui.position.deltaY })}>
        <QuestionNode lang={lang} onChoiceTextChanged={onChoiceTextChanged} {...q} />
      </DraggableNodeWrapper>)}
    {clips.map(c =>
      <DraggableNodeWrapper key={c.id}
                     x={c.x}
                     y={c.y}
                     onDrag={(e, ui) => onDrag(nodeTypes.CLIP_NODE, c.id, { x: ui.position.deltaX, y: ui.position.deltaY })}>
        <ClipNode lang={lang} {...c} />
      </DraggableNodeWrapper>)}
  </div>
);

const mapStateToProps = state => {
  return {
    questions: state.getIn(['graph', 'questions']),
    clips: state.getIn(['graph', 'clips']),
    lang: state.get('lang'),
    zoom: state.get('zoom')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDrag: (nodeType, id, delta) => {
      dispatch({
        type: actionTypes.DRAG_NODE,
        nodeType,
        id,
        delta
      });
    },
    onChoiceTextChanged: (id, lang, index, text) => {
      dispatch({
        type: commonActionTypes.CHOICE_TEXT_CHANGED,
        id,
        lang,
        index,
        text
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphView);
