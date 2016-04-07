import React from 'react';
import { pure } from 'recompose';
import { VelocityTransitionGroup } from 'velocity-react';
import path from 'path';
import fs from 'fs';
import FastInput from '../../Components/FastInput';

import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

//HACK: we need '...props' here for DraggableCore to connect its handlers.
//(Alternately, we could specify the drag handlers explicitly here.)
const ClipNode = ({ clip,
                    style,
                    lang,
                    cwd,
                    questionIds,
                    clipIds,
                    focused,
                    incomingQuestions,
                    incomingClips,
                    onRemoveClip,
                    onCaptionTextChanged,
                    onCaptionTimeChanged,
                    onCaptionAdded,
                    onCaptionRemoved,
                    onClipTargetChanged,
                    onClipVideoChanged,
                    onFocus,
                    ...props
                  }) => {
  const id = clip.get('id');
  const next = clip.get('next');
  const videoSrc = clip.getIn(['video', 'src']);
  const strings = clip.get('strings');

  const targetIndicator = getTargetIndicator(next, onFocus, questionIds, clipIds);

  const videoPath = path.join(cwd, 'video', videoSrc + '.mov');
  const videoExists = fs.existsSync(videoPath);

  let className = 'highlightable-node panel panel-default';
  if(focused) { className += ' focused'; }

  return (
  <div
    id={'clip-' + id}
    className={className}
    style={{...style, margin:'0 5px 10px 5px', backgroundColor: '#999'}}
    {...props}>
    <div className='panel-heading'>
      <div className='row'>
        <div className='col-xs-12'>
          CLIP {id}
          <button className='btn btn-default btn-xs' style={{float:'right'}} onClick={function() { onRemoveClip(id); }}>
            <span className='text-muted glyphicon glyphicon-remove'></span>
          </button>
        </div>
      </div>
    </div>
    <div className='panel-body'>
      <div className='row'>
        <div className='col-xs-12' style={{textAlign: 'center'}}>
          {videoExists ?
            <div className='panel'
                 style={{width:'100%', height:200 }}>
              <video className='panel panel-default'
                     style={{height: 200, width:'100%', marginBottom:0 }}
                     src={videoPath}
                     controls />
            </div>

            :
            <div className='panel panel-warning'
                 style={{width:'100%', height:200, lineHeight:'200px' }}>
              {`Video file "${videoPath}" not found!`}
            </div>
          }
        </div>
      </div>
      <div className='row' style={{marginBottom:20}}>
        <div className='col-xs-8 col-xs-offset-2'>
          <div className='input-group input-group-sm'>
            <FastInput
              type='text'
              style={{backgroundColor:'#464545', color:'#FFF', textAlign:'center'}}
              className='form-control'
              placeholder='Video'
              onChange={function(e) { onClipVideoChanged(id, e.target.value); }}
              value={videoSrc !== undefined ? videoSrc : ''} />
            <span style={{backgroundColor:'#111'}} className='input-group-addon'>
              {videoExists ?
                // <a href={videoPath} target='_blank'>
                <span className='text-success glyphicon glyphicon-ok' />
                // </a>
                :
                <span className='text-warning glyphicon glyphicon-warning-sign' />
              }
            </span>
          </div>
        </div>
      </div>
      <VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>
        {strings.get(lang).map((s, i) => (
          <div className='row' key={i} style={{marginBottom:'10px'}}>
            <div className='col-xs-1'>
              <button className='btn btn-default btn-xs' style={{marginTop:10}} onClick={function() { onCaptionRemoved(id, i); }}>
                <span className='text-muted glyphicon glyphicon-trash'></span>
              </button>
            </div>
            <div className='col-xs-2' style={{paddingRight:0}}>
              <input
                type='number'
                className='form-control'
                placeholder='(s)'
                onChange={function(e) { onCaptionTimeChanged(id, i, Math.floor(e.target.value)); }}
                value={s.get(0) !== undefined ? s.get(0) : ''} />
            </div>
            <div className='col-xs-9'>
              <FastInput
                type='text'
                className='form-control'
                placeholder={'Caption: ' + lang}
                onChange={function(e) { onCaptionTextChanged(id, lang, i, e.target.value); }}
                value={s.get(1) !== undefined ? s.get(1) : ''}
              />
            </div>
          </div>
        ))}
      </VelocityTransitionGroup>
      <div className='row' style={{marginTop:10}}>
        <div className='col-xs-1'>
          <button className='btn btn-default btn-xs' onClick={function() { onCaptionAdded(id); }}>
            <span className='glyphicon glyphicon-plus'></span>
          </button>
        </div>
      </div>
      <div className='row' style={{marginTop:10}}>
        <div className='col-xs-7' style={{lineHeight:'35px'}}>
          {(incomingQuestions || incomingClips)
            ? ''
            : <span className='label label-warning'>No incoming clips or questions</span> }

          {incomingQuestions ?
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={
              <Popover id="dummy" style={{textAlign:'center'}}>
                {incomingQuestions.map(q => <a key={q}
                                               className='btn btn-default btn-xs text-success'
                                               style={{margin: 5}}
                                               href='#'
                                               onClick={function(e) { e.preventDefault(); onFocus(q, 'questions');}}>
                                               {q}
                                             </a>)}
              </Popover>
            }>
              <Button bsStyle="default" bsSize="small" style={{marginRight: 5}}>{incomingQuestions.size} Question{incomingQuestions.size > 1 ? 's' : ''}</Button>
            </OverlayTrigger>
            : ''}
          {incomingClips ?
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={
              <Popover id="dummy" style={{textAlign:'center'}}>
                {incomingClips.map(c => <a key={c}
                                           className='btn btn-default btn-xs text-success'
                                           style={{margin: 5}}
                                           href='#'
                                           onClick={function(e) { e.preventDefault(); onFocus(c, 'clips');}}>
                                         {c}
                                       </a>)}
              </Popover>
            }>
              <Button bsStyle="default" bsSize="small">{incomingClips.size} Clip{incomingClips.size > 1 ? 's' : ''}</Button>
            </OverlayTrigger>
            : ''}
        </div>
        {/* The clip target field. */}
        <div className='col-xs-5' style={{overflowWrap: 'break-word', textAlign: 'center', marginBottom:0}}>
          <div className='input-group input-group-sm'>
            <FastInput
              type='text'
              className='form-control'
              placeholder='Target'
              onChange={function(e) { onClipTargetChanged(id, parseInputText(e.target.value)); }}
              value={next !== undefined ? getTargetText(next) : ''} />
            <span className='input-group-addon'>
              {targetIndicator}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);};


///////////////
// HACK: this pair of functions is here because Luc requested the ability to use
// 'Q' or 'C' instead of 'question:' or 'clip:' in the field.
function getTargetText(nextField) {
  const target = nextField.split(':');
  if(target.length === 2) {
    if(target[0] === 'clip') {
      return 'C' + target[1];
    }
    if(target[0] === 'question') {
      return 'Q' + target[1];
    }
  }
  return nextField;
}

function parseInputText(inputValue) {
  if(inputValue[0].toUpperCase() === 'C' && !Number.isNaN(parseInt(inputValue[1], 10))) {
    return 'clip:' + inputValue.slice(1);
  }
  if(inputValue[0].toUpperCase() === 'Q' && !Number.isNaN(parseInt(inputValue[1], 10))) {
    return 'question:' + inputValue.slice(1);
  }
  return inputValue;
}
///////////////


function getTargetIndicator(nextField, onFocus, questionIds, clipIds) {
  const target = nextField.split(':');
  const id = target[0] === 'clip' || target[0] === 'question'
    ? parseInt(target[1], 10)
    : null;

  switch(target[0]) {
    case 'clip':
      if(clipIds.has(id)) {
        return (
          <a
            href='#'
            onClick={function(e) { e.preventDefault(); onFocus(id, 'clips');}}>
            <span className='glyphicon glyphicon-arrow-right' />
          </a>
        );
      }
      //Otherwise, it's not a valid id.
      return (<span className='text-warning glyphicon glyphicon-warning-sign' />);
    case 'question':
      if(questionIds.has(id)) {
        return (
          <a
            href='#'
            onClick={function(e) { e.preventDefault(); onFocus(id, 'questions');}}>
            <span className='glyphicon glyphicon-arrow-right' />
          </a>
        );
      }
      //Otherwise, it's not a valid id.
      return (<span className='text-warning glyphicon glyphicon-warning-sign' />);
    default:
      //It might be a script, or anything else.
      return (<span className='text-warning glyphicon glyphicon-question-sign' />);
  }
}

export default pure(ClipNode);
