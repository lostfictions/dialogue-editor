import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';


//HACK: we need '...props' here for DraggableCore to connect its handlers.
//(Alternately, we could specify the exact handlers ourselves.)
const QuestionNode = ({ question,
                        lang,
                        clipIds,
                        incomingClips,
                        onChoiceTextChanged,
                        onChoiceTargetChanged,
                        onChoiceAdded,
                        onChoiceRemoved,
                        onRemoveQuestion,
                        style,
                        ...props
                      }) => {
  //HACK: hide language-setter special case.
  // if(question.getIn(['choices', 0, 'strings', '*']) !== undefined) {
  //   return <div></div>;
  // }
  const id = question.get('id');
  const choices = question.get('choices');
  const video = question.get('video');
  return (
    <div
      id={'question-' + id}
      className='highlightable-node panel panel-default'
      style={{...style, margin:'0 5px 10px 5px', backgroundColor: '#999'}}
      {...props}>
      <div className='panel-heading'>
        <div className='row'>
          <div className='col-xs-12'>
            QUESTION {id}
            <button className='btn btn-default btn-xs' style={{float:'right'}} onClick={() => onRemoveQuestion(id)}>
              <span className='text-muted glyphicon glyphicon-remove'></span>
            </button>
          </div>
        </div>
      </div>
      <div className='panel-body'>
        <VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>
          {choices.map((c, i) => {
            const answer = c.get('answer');
            return (
            <div key={i} className='row' style={{marginBottom:'10px'}}>
              <div className='col-xs-1'>
                <button className='btn btn-default btn-xs' style={{marginTop:10}} onClick={() => onChoiceRemoved(id, i)}>
                  <span className='text-muted glyphicon glyphicon-trash'></span>
                </button>
              </div>
              <div className='col-xs-7' style={{paddingRight:0}}>
                <input
                  type='text'
                  className='form-control'
                  placeholder={'Choice text: ' + lang}
                  onChange={e => onChoiceTextChanged(id, lang, i, e.target.value)}
                  value={c.getIn(['strings', lang]) || ''} />
              </div>
              <div className='col-xs-4'>
                <div className='input-group'>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Clip'
                    onChange={e => onChoiceTargetChanged(id, i, Math.floor(e.target.value))}
                    value={answer !== undefined ? answer : ''} />
                  <span className='input-group-addon'>
                    {clipIds.has(answer) ?
                      <a href={'#clip-'+answer}>
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
            <button type='button' className='btn btn-default btn-xs' onClick={() => onChoiceAdded(id)}>
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
                                          href={'#clip-'+c}>{c}</a>)
              : <span className='label label-warning'>None</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNode;