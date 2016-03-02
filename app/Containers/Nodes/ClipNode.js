import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import path from 'path';
import fs from 'fs';

//HACK: we need '...props' here for DraggableCore to connect its handlers.
//(Alternately, we could specify the exact handlers ourselves.)
const ClipNode = ({ clip,
                    style,
                    lang,
                    cwd,
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
                    onClipVideoChanged,
                    ...props
                  }) => {
  const id = clip.get('id');
  const next = clip.get('next');
  const videoSrc = clip.getIn(['video', 'src']);
  const strings = clip.get('strings');

  const target = next.split(':');
  let targetIndicator;
  if(target[0] === 'clip') {
    if(clipIds.has(parseInt(target[1], 10))) {
      targetIndicator = (<a href={'#' + next.replace(':', '-') }>
        <span className='glyphicon glyphicon-arrow-right' />
      </a>);
    }
    else {
      targetIndicator = (<span className='text-warning glyphicon glyphicon-warning-sign' />);
    }
  }
  else if(target[0] === 'question') {
    if(questionIds.has(parseInt(target[1], 10))) {
      targetIndicator = (<a href={'#' + next.replace(':', '-') }>
        <span className='glyphicon glyphicon-arrow-right' />
      </a>);
    }
    else {
      targetIndicator = (<span className='text-warning glyphicon glyphicon-warning-sign' />);
    }
  }
  else {
    targetIndicator = (<span className='text-warning glyphicon glyphicon-question-sign' />);
  }

  const videoPath = path.join(cwd, 'video', videoSrc + '.m4v');
  const videoExists = fs.existsSync(videoPath);

  return (
  <div
    id={'clip-' + id}
    className='highlightable-node panel panel-default'
    style={{...style, margin:'0 5px 10px 5px', backgroundColor: '#999'}}
    {...props}>
    <div className='panel-heading'>
      <div className='row'>
        <div className='col-xs-12'>
          CLIP {id}
          <button className='btn btn-default btn-xs' style={{float:'right'}} onClick={() => onRemoveClip(id)}>
            <span className='text-muted glyphicon glyphicon-remove'></span>
          </button>
        </div>
      </div>
    </div>
    <div className='panel-body'>
      <div className='row'>
        <div className='col-xs-12' style={{textAlign: 'center'}}>
          {videoExists ?
            <video className='panel panel-default'
                   style={{width:'100%', marginBottom:0 }}
                   src={videoPath}
                   controls />
            :
            <div className='panel panel-warning'
                 style={{width:'100%', height:200 }}>
              {`Video file "${videoPath}" not found!`}
            </div>
          }
        </div>
      </div>
      <div className='row' style={{marginBottom:20}}>
        <div className='col-xs-4 col-xs-offset-4'>
          <div className='input-group input-group-sm'>
            <input
              type='text'
              style={{backgroundColor:'#464545', color:'#FFF', textAlign:'center'}}
              className='form-control'
              placeholder='Video'
              onChange={e => onClipVideoChanged(id, e.target.value)}
              value={videoSrc || ''} />
            <span style={{backgroundColor:'#111'}} className='input-group-addon'>
              {videoExists ?
                <a href={videoPath} target='_blank'>
                  <span className='glyphicon glyphicon-eye-open' />
                </a>
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
              <button className='btn btn-default btn-xs' style={{marginTop:10}} onClick={() => onCaptionRemoved(id, i)}>
                <span className='text-muted glyphicon glyphicon-trash'></span>
              </button>
            </div>
            <div className='col-xs-2' style={{paddingRight:0}}>
              <input
                type='number'
                className='form-control'
                placeholder='(s)'
                onChange={e => onCaptionTimeChanged(id, i, Math.floor(e.target.value))}
                value={s.get(0) || ''} />
            </div>
            <div className='col-xs-9'>
              <input
                type='text'
                className='form-control'
                placeholder={'Caption: ' + lang}
                onChange={e => onCaptionTextChanged(id, lang, i, e.target.value)}
                value={s.get(1) || ''} />
            </div>
          </div>
        ))}
      </VelocityTransitionGroup>
      <div className='row' style={{marginTop:10}}>
        <div className='col-xs-1'>
          <button className='btn btn-default btn-xs' onClick={() => onCaptionAdded(id)}>
            <span className='glyphicon glyphicon-plus'></span>
          </button>
        </div>
      </div>
      <div className='row' style={{marginTop:10}}>
        <div className='col-xs-7' style={{lineHeight:'35px'}}>
          {(incomingQuestions || incomingClips)
            ? ''
            : <span className='label label-warning'>No incoming clips or questions</span> }

          {incomingQuestions
            ? <div>
                <span className='small' style={{marginRight: 8}}>Questions</span>
                {incomingQuestions.map(q => <a key={q}
                                            className='btn btn-default btn-xs text-success'
                                            style={{marginRight: 5}}
                                            href={'#question-'+q}>{q}</a>)}
              </div>
            : ''}
          {incomingClips
            ? <div>
                <span className='small' style={{marginRight: 8}}>Clips</span>
                {incomingClips.map(c => <a key={c}
                                            className='btn btn-default btn-xs text-success'
                                            style={{marginRight: 5}}
                                            href={'#clip-'+c}>{c}</a>)}
              </div>
            : ''}
        </div>
        <div className='col-xs-5' style={{overflowWrap: 'break-word', textAlign: 'center', marginBottom:0}}>
          <div className='input-group input-group-sm'>
            <input
              type='text'
              className='form-control'
              placeholder='Target'
              onChange={e => onClipTargetChanged(id, e.target.value)}
              value={next || ''} />
            <span className='input-group-addon'>
              {targetIndicator}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);};

export default ClipNode;
