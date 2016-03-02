import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Column } from '../../Containers/ListView';
import QuestionNode from '../../Containers/Nodes/QuestionNode';

import { graphAndListViewActionTypes as actionTypes } from '../../Constants';

const QuestionsColumn = ({ onAddQuestion,
                           questions,
                           lang,
                           clipIds,
                           incomingClips,
                           onRemoveQuestion,
                           onChoiceTextChanged,
                           onChoiceTargetChanged,
                           onChoiceAdded,
                           onChoiceRemoved
                         }) => (
  <Column title='QUESTIONS' onClickAdd={onAddQuestion}>
    {questions.map(q =>
      <QuestionNode key={q.get('id')}
                    lang={lang}
                    clipIds={clipIds}
                    incomingClips={incomingClips.get(q.get('id'))}
                    onRemoveQuestion={onRemoveQuestion}
                    onChoiceTextChanged={onChoiceTextChanged}
                    onChoiceTargetChanged={onChoiceTargetChanged}
                    onChoiceAdded={onChoiceAdded}
                    onChoiceRemoved={onChoiceRemoved}
                    question={q} />)}
  </Column>
);

const clipsSelector = state => state.getIn(['graph', 'clips']);
const incomingClipsSelector = createSelector(
  clipsSelector,
  clips => {
    return clips
      //We only want clips that point to questions
      .filter(clip => clip.get('next').startsWith('question:'))
      //Group clips by the question they point to
      .groupBy(c => parseInt(c.get('next').substr('question:'.length), 10))
      //The only property we need from each group of clips is the clip id
      .map(v => v.map(c => c.get('id')));
  }
);

const mapStateToProps = state => {
  return {
    questions: state.getIn(['graph', 'questions']),
    clipIds: state.get('clipIds'),
    lang: state.get('lang'),
    incomingClips: incomingClipsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChoiceTextChanged: (id, lang, index, text) => {
      dispatch({
        type: actionTypes.CHOICE_TEXT_CHANGED,
        id,
        lang,
        index,
        text
      });
    },
    onChoiceTargetChanged: (id, index, target) => {
      dispatch({
        type: actionTypes.CHOICE_TARGET_CHANGED,
        id,
        index,
        target
      });
    },
    onChoiceAdded: (id) => {
      dispatch({
        type: actionTypes.CHOICE_ADDED,
        id
      });
    },
    onChoiceRemoved: (id, index) => {
      dispatch({
        type: actionTypes.CHOICE_REMOVED,
        id,
        index
      });
    },
    onAddQuestion: () => {
      dispatch({
        type: actionTypes.ADD_QUESTION
      });
    },
    onRemoveQuestion: (id) => {
      dispatch({
        type: actionTypes.REMOVE_QUESTION,
        id
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsColumn);