import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map, Set } from 'immutable';

import Column from '../../Containers/Column';
import ClipNode from '../../Containers/Nodes/ClipNode';

import { sharedActionTypes } from '../../Constants';

import path from 'path';

export const actionTypes = {
  CAPTION_TEXT_CHANGED: 'CAPTION_TEXT_CHANGED',
  CAPTION_TIME_CHANGED: 'CAPTION_TIME_CHANGED',
  CAPTION_ADDED: 'CAPTION_ADDED',
  CAPTION_REMOVED: 'CAPTION_REMOVED',
  CLIP_TARGET_CHANGED: 'CLIP_TARGET_CHANGED',
  CLIP_VIDEO_CHANGED: 'CLIP_VIDEO_CHANGED',
  ADD_CLIP: 'ADD_CLIP',
  REMOVE_CLIP: 'REMOVE_CLIP'
};

const ClipsColumn = ({
                       clips,
                       lang,
                       filename,
                       questionIds,
                       clipIds,
                       incomingQuestions,
                       incomingClips,
                       searchText,
                       focusedItem,
                       onAddClip,
                       onRemoveClip,
                       onCaptionTextChanged,
                       onCaptionTimeChanged,
                       onCaptionAdded,
                       onCaptionRemoved,
                       onClipTargetChanged,
                       onClipVideoChanged,
                       onSearch,
                       onFocus
                     }) => {
  const getIndexFromId = function(id) {
    return clips.findIndex(function(item){ return item.get('id') === id;});
  };
  return (
  <Column
    title='clips'
    onClickAdd={onAddClip}
    itemGetter={function(i) {
      const c = clips.get(i);
      const id = c.get('id');
      return (<ClipNode
        key={id}
        lang={lang}
        questionIds={questionIds}
        clipIds={clipIds}
        incomingQuestions={incomingQuestions.get(id)}
        incomingClips={incomingClips.get(id)}
        focused={id===focusedItem}
        cwd={path.dirname(filename)}
        onRemoveClip={onRemoveClip}
        onCaptionTextChanged={onCaptionTextChanged}
        onCaptionTimeChanged={onCaptionTimeChanged}
        onCaptionAdded={onCaptionAdded}
        onCaptionRemoved={onCaptionRemoved}
        onClipTargetChanged={onClipTargetChanged}
        onClipVideoChanged={onClipVideoChanged}
        onFocus={onFocus}
        clip={c} />);
    }}
    itemCount={clips.size}
    getIndexFromId={getIndexFromId}
    sizeGetter={function(i) {
      const captions = clips.getIn([i, 'strings', lang]);
      const captionsSize = captions ? captions.size * 55 : 0;
      return (
        424 + /* base height*/
        2 + /* border */
        10 +  /* margin-bottom */
        captionsSize /* each caption row */
      );
    }}
    onSearch={onSearch}
    searchText={searchText}
    focusedItem={focusedItem}
    onFocus={onFocus}
  />
);
};

//This is a bit gnarly/effectful, maybe worth cleaning up later
const getQuestions = state => state.getIn(['graph', 'questions']);
const incomingQuestionsSelector = createSelector(
  getQuestions,
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

const getClips = state => state.getIn(['graph', 'clips']);
const incomingClipsSelector = createSelector(
  getClips,
  clips => clips
    //We only want clips that point to other clips
    .filter(clip => clip.get('next').startsWith('clip:'))
    //Group clips by the clip they point to
    .groupBy(c => parseInt(c.get('next').substr('clip:'.length), 10))
    //The only property we need from each group of clips is the clip id
    .map(v => v.map(c => c.get('id')))
);

const getFilterQuery = state => state.getIn(['filters', 'clips']);
const clipsSelector = createSelector(
  [getClips, getFilterQuery],
  (clips, filterQuery) => {
    if(!filterQuery) {
      return clips;
    }

    const query = filterQuery.toLowerCase();
    return clips.filter(
      c => c
        .get('strings')
        .map(captionList => captionList.map(timestamped => timestamped.get(1)))
        .valueSeq()
        .flatten()
        .some(caption => caption.toLowerCase().indexOf(query) > -1)
    );
  }
);

const mapStateToProps = state => ({
  clips: clipsSelector(state),
  questionIds: state.get('questionIds'),
  clipIds: state.get('clipIds'),
  lang: state.get('lang'),
  filename: state.get('currentFilename'),
  incomingQuestions: incomingQuestionsSelector(state),
  incomingClips: incomingClipsSelector(state),
  searchText: state.getIn(['filters', 'clips']),
  focusedItem: state.getIn(['focused', 'clips'])
});

const mapDispatchToProps = dispatch => ({
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
  },
  onSearch: (query) => {
    dispatch({
      type: sharedActionTypes.FILTER_COLUMN,
      query,
      column: 'clips'
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

export default connect(mapStateToProps, mapDispatchToProps)(ClipsColumn);
