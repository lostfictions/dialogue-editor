import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map, Set } from 'immutable';

import { Column } from '../../Containers/ListView';
import ClipNode from '../../Containers/Nodes/ClipNode';

import { graphAndListViewActionTypes as actionTypes } from '../../Constants';

import path from 'path';

const ClipsColumn = ({ onAddClip,
                       clips,
                       lang,
                       filename,
                       questionIds,
                       clipIds,
                       incomingQuestions,
                       incomingClips,
                       onRemoveClip,
                       onCaptionTextChanged,
                       onCaptionTimeChanged,
                       onCaptionAdded,
                       onCaptionRemoved,
                       onClipTargetChanged,
                       onClipVideoChanged
                     }) => (
  <Column title='CLIPS' onClickAdd={onAddClip}>
    {clips.map(c =>
      <ClipNode key={c.get('id')}
                lang={lang}
                questionIds={questionIds}
                clipIds={clipIds}
                incomingQuestions={incomingQuestions.get(c.get('id'))}
                incomingClips={incomingClips.get(c.get('id'))}
                cwd={path.dirname(filename)}
                onRemoveClip={onRemoveClip}
                onCaptionTextChanged={onCaptionTextChanged}
                onCaptionTimeChanged={onCaptionTimeChanged}
                onCaptionAdded={onCaptionAdded}
                onCaptionRemoved={onCaptionRemoved}
                onClipTargetChanged={onClipTargetChanged}
                onClipVideoChanged={onClipVideoChanged}
                clip={c} />)}
  </Column>
);

//This is a bit gnarly/effectful, maybe worth cleaning up later
const questionsSelector = state => state.getIn(['graph', 'questions']);
const incomingQuestionsSelector = createSelector(
  questionsSelector,
  questions => {
    let clipsToIncomingQuestions = Map();

    questions
      .forEach(q =>
        q
          .get('choices')
          .map(choice => choice.get('answer'))
          .forEach(a =>
            clipsToIncomingQuestions = clipsToIncomingQuestions.update(a, Set(), ids => ids.add(q.get('id')))
          )
      );

    return clipsToIncomingQuestions;
  }
);

const clipsSelector = state => state.getIn(['graph', 'clips']);
const incomingClipsSelector = createSelector(
  clipsSelector,
  clips => {
    return clips
      //We only want clips that point to other clips
      .filter(clip => clip.get('next').startsWith('clip:'))
      //Group clips by the clip they point to
      .groupBy(c => parseInt(c.get('next').substr('clip:'.length), 10))
      //The only property we need from each group of clips is the clip id
      .map(v => v.map(c => c.get('id')));
  }
);

const mapStateToProps = state => {
  return {
    clips: state.getIn(['graph', 'clips']),
    questionIds: state.get('questionIds'),
    clipIds: state.get('clipIds'),
    lang: state.get('lang'),
    filename: state.get('currentFilename'),
    incomingQuestions: incomingQuestionsSelector(state),
    incomingClips: incomingClipsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCaptionTextChanged: (id, lang, index, text) => {
      dispatch({
        type: actionTypes.CAPTION_TEXT_CHANGED,
        id,
        lang,
        index,
        text
      });
    },
    onCaptionTimeChanged: (id, index, time) => {
      dispatch({
        type: actionTypes.CAPTION_TIME_CHANGED,
        id,
        index,
        time
      });
    },
    onCaptionAdded: (id) => {
      dispatch({
        type: actionTypes.CAPTION_ADDED,
        id
      });
    },
    onCaptionRemoved: (id, index) => {
      dispatch({
        type: actionTypes.CAPTION_REMOVED,
        id,
        index
      });
    },
    onClipTargetChanged: (id, target) => {
      dispatch({
        type: actionTypes.CLIP_TARGET_CHANGED,
        id,
        target
      });
    },
    onClipVideoChanged: (id, src) => {
      dispatch({
        type: actionTypes.CLIP_VIDEO_CHANGED,
        id,
        src
      });
    },
    onAddClip: () => {
      dispatch({
        type: actionTypes.ADD_CLIP
      });
    },
    onRemoveClip: (id) => {
      dispatch({
        type: actionTypes.REMOVE_CLIP,
        id
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClipsColumn);