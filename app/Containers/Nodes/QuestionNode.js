import React from 'react';
import { pure } from 'recompose';
import { VelocityTransitionGroup } from 'velocity-react';
import FastInput from '../../Components/FastInput';

//HACK: we need '...props' here for DraggableCore to connect its handlers.
//(Alternately, we could specify the drag handlers explicitly here.)
const QuestionNode = ({ question,
                        lang,
                        clipIds,
                        incomingClips,
                        focused,
                        onChoiceTextChanged,
                        onChoiceTargetChanged,
                        onChoiceAdded,
                        onChoiceRemoved,
                        onRemoveQuestion,
                        onFocus,
                        style,
                        ...props
                      }) => {
  // HACK: in the portrait-one schema, the first question is a special case
  // that allows each choice to set a different language using a unique language
  // identifier and a special field.
  //
  // Ideally, this should be its own variety of node (just as each kind of 'script'
  // node should be) to minimize confusion and avoid special cases.
  //
  // Here's one such special case. Since the language identifier for the language-
  // chooser question is unique ('*' instead of 'en', 'fr', 'de', etc.), it
  // doesn't make sense to show it in our editor's language switcher. (It would
  // just hide all the other text in the editor.)
  //
  // So we check for it whenever we render a QuestionNode, and do something special
  // like render a different variant for it -- or just hide it, like I'm doing here.

  // That said, I've just commented out this check because the new JSON files won't
  // necessarily use portrait-one's switcher syntax.
  // Besides, react-list (used in Containers/Column.js) works best if we can
  // give it the height of each item. Keeping this hack complicates that logic.

  // if(question.getIn(['choices', 0, 'strings', '*']) !== undefined) {
  //   return <div></div>;
  // }

  const id = question.get('id');
  const choices = question.get('choices');
  // const video = question.get('video');
  let className = 'highlightable-node panel panel-default';
  if(focused) { className += ' focused'; }
  return (
    <div
      id={'question-' + id}
      className={className}
      style={{...style, margin:'0 5px 10px 5px', backgroundColor: '#999'}}
      {...props}>
      <div className='panel-heading'>
        <div className='row'>
          <div className='col-xs-12'>
            QUESTION {id}
            <button className='btn btn-default btn-xs' style={{float:'right'}} onClick={function() { onRemoveQuestion(id); }}>
              <span className='text-muted glyphicon glyphicon-remove'></span>
            </button>
          </div>
        </div>
      </div>
      <div className='panel-body'>
        <VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>
          {choices.map((c, i) => {
            const choiceText = c.getIn(['strings', lang]);
            const answer = c.get('answer');
            return (
            <div key={i} className='row' style={{marginBottom:'10px'}}>
              <div className='col-xs-1'>
                <button className='btn btn-default btn-xs' style={{marginTop:10}} onClick={function() { onChoiceRemoved(id, i); }}>
                  <span className='text-muted glyphicon glyphicon-trash'></span>
                </button>
              </div>
              <div className='col-xs-7' style={{paddingRight:0}}>
                <FastInput
                  type='text'
                  className='form-control'
                  placeholder={'Choice text: ' + lang}
                  onChange={function(e) { onChoiceTextChanged(id, lang, i, e.target.value); }}
                  value={choiceText !== undefined ? choiceText : ''} />
              </div>
              <div className='col-xs-4'>
                <div className='input-group'>
                  <FastInput
                    type='number'
                    className='form-control'
                    placeholder='Clip'
                    onChange={function(e) { onChoiceTargetChanged(id, i, Math.floor(e.target.value)); }}
                    value={answer !== undefined ? answer : ''} />
                  <span className='input-group-addon'>
                    {clipIds.has(answer) ?
                      <a
                        href='#'
                        onClick={function(e) { e.preventDefault(); onFocus(answer, 'clips');}}>
                        <span className='glyphicon glyphicon-arrow-right' />
                      </a>
                      :
                      <span className='text-warning glyphicon glyphicon-warning-sign' />
                    }
                  </span>
                </div>
              </div>
            </div>
          );})}
        </VelocityTransitionGroup>
        <div className='row'>
          <div className='col-xs-1'>
            <button type='button' className='btn btn-default btn-xs' onClick={function() { onChoiceAdded(id); }}>
              <span className='glyphicon glyphicon-plus'></span>
            </button>
          </div>
          {/*<div className='col-xs-3 small' style={{lineHeight:'25px'}}>
            {video ?
              <span>Video: <a href='#'> {video.get('src')}</a></span> //TODO: support adding videos to questions
              : ''}
          </div>*/}
          <div className='col-xs-11 text-right'>
            <span className='small' style={{marginRight: 5}}>Incoming Clips</span>
            {incomingClips
              ? incomingClips.map(c => <a key={c}
                                          className='btn btn-default btn-xs text-success'
                                          style={{marginLeft: 5}}
                                          href='#'
                                          onClick={function(e) { e.preventDefault(); onFocus(c, 'clips');}}>
                                          {c}
                                        </a>)
              : <span className='label label-warning'>None</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default pure(QuestionNode);