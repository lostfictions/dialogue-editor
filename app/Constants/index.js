export const languages = ['en', 'fr', 'de'/*, '*'*/];

export const viewModes = {
  LIST: 'LIST',
  GRAPH: 'GRAPH'
};

export const nodeTypes = {
  QUESTION_NODE: 'QUESTION_NODE',
  CLIP_NODE: 'CLIP_NODE'
};

export const graphAndListViewActionTypes = {
  CHOICE_TEXT_CHANGED: 'CHOICE_TEXT_CHANGED',
  CHOICE_TARGET_CHANGED: 'CHOICE_TARGET_CHANGED',
  CHOICE_ADDED: 'CHOICE_ADDED',
  CHOICE_REMOVED: 'CHOICE_REMOVED',

  CAPTION_TEXT_CHANGED: 'CAPTION_TEXT_CHANGED',
  CAPTION_TIME_CHANGED: 'CAPTION_TIME_CHANGED',
  CAPTION_ADDED: 'CAPTION_ADDED',
  CAPTION_REMOVED: 'CAPTION_REMOVED',

  CLIP_TARGET_CHANGED: 'CLIP_TARGET_CHANGED',
  CLIP_VIDEO_CHANGED: 'CLIP_VIDEO_CHANGED',

  ADD_QUESTION: 'ADD_QUESTION',
  REMOVE_QUESTION: 'REMOVE_QUESTION',
  ADD_CLIP: 'ADD_CLIP',
  REMOVE_CLIP: 'REMOVE_CLIP'
};


