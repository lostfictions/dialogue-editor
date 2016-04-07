import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Column from '../../Containers/Column';
import QuestionNode from '../../Containers/Nodes/QuestionNode';

import { sharedActionTypes } from '../../Constants';

export const actionTypes = {
  CHOICE_TEXT_CHANGED: 'CHOICE_TEXT_CHANGED',
  CHOICE_TARGET_CHANGED: 'CHOICE_TARGET_CHANGED',
  CHOICE_ADDED: 'CHOICE_ADDED',
  CHOICE_REMOVED: 'CHOICE_REMOVED',
  ADD_QUESTION: 'ADD_QUESTION',
  REMOVE_QUESTION: 'REMOVE_QUESTION'
};

const QuestionsColumn = ({ onAddQuestion,
                           questions,
                           lang,
                           clipIds,
                           incomingClips,
                           searchText,
                           focusedItem,
                           onRemoveQuestion,
                           onChoiceTextChanged,
                           onChoiceTargetChanged,
                           onChoiceAdded,
                           onChoiceRemoved,
                           onSearch,
                           onFocus
                         }) => {
  const getIndexFromId = function(id) {
    return questions.findIndex(function(item){ return item.get('id') === id;});
  };
  return (
  <Column
    title='questions'
    onClickAdd={onAddQuestion}
    itemGetter={function(i) {
      const q = questions.get(i);
      const id = q.get('id');
      return (<QuestionNode
        key={id}
        lang={lang}
        clipIds={clipIds}
        incomingClips={incomingClips.get(id)}
        focused={id===focusedItem}
        onRemoveQuestion={onRemoveQuestion}
        onChoiceTextChanged={onChoiceTextChanged}
        onChoiceTargetChanged={onChoiceTargetChanged}
        onChoiceAdded={onChoiceAdded}
        onChoiceRemoved={onChoiceRemoved}
        onFocus={onFocus}
        question={q} />);
    }}
    itemCount={questions.size}
    getIndexFromId={getIndexFromId}
    // These sizeGetters are obviously incredibly brittle, but we don't seem to
    // have a better choice than to hardcode the size like this. This is going
    // to break a lot if you change the node, so I've tried to document the
    // magic numbers as much as I can. Sorry in advance, anyway...
    sizeGetter={function(i) {
      return (
        101 + /* base height*/
        2 + /* border */
        10 +  /* margin-bottom */
        questions.getIn([i, 'choices']).size * 55 /* each choice row */
      );
    }}
    onSearch={onSearch}
    searchText={searchText}
    focusedItem={focusedItem}
    onFocus={onFocus}
  />
);
};

const clipsSelector = state => state.getIn(['graph', 'clips']);
const incomingClipsSelector = createSelector(
  clipsSelector,
  clips => clips
    //We only want clips that point to questions
    .filter(clip => clip.get('next').startsWith('question:'))
    //Group clips by the question they point to
    .groupBy(c => parseInt(c.get('next').substr('question:'.length), 10))
    //The only property we need from each group of clips is the clip id
    .map(v => v.map(c => c.get('id')))
);

const getQuestions = state => state.getIn(['graph', 'questions']);
const getFilterQuery = state => state.getIn(['filters', 'questions']);
const questionsSelector = createSelector(
  [getQuestions, getFilterQuery],
  (questions, filterQuery) => {
    if(!filterQuery) {
      return questions;
    }

    const query = filterQuery.toLowerCase();
    return questions.filter(
      q => q
        .get('choices')
        .flatMap(c => c.get('strings'))
        .map(s => s[1])
        .some(choice => choice.toLowerCase().indexOf(query) > -1)
    );
  }
);

const mapStateToProps = state => ({
  questions: questionsSelector(state),
  clipIds: state.get('clipIds'),
  lang: state.get('lang'),
  incomingClips: incomingClipsSelector(state),
  searchText: state.getIn(['filters', 'questions']),
  focusedItem: state.getIn(['focused', 'questions'])
});

const mapDispatchToProps = dispatch => ({
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
  },
  onSearch: (query) => {
    dispatch({
      type: sharedActionTypes.FILTER_COLUMN,
      query,
      column: 'questions'
    });
  },
  onFocus: (id, column) => {
    dispatch({
      type: sharedActionTypes.FOCUS_ITEM,
      id,
      column
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsColumn);
