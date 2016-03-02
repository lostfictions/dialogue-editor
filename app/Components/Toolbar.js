import React from 'react';
import { connect } from 'react-redux';
import { viewModes, languages } from '../Constants';
import path from 'path';
import { remote } from 'electron';

export const actionTypes = {
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_LANG: 'SET_LANG',
  SET_ZOOM: 'SET_ZOOM',
  OPEN_FILE: 'OPEN_FILE',
  SAVE_FILE_AS: 'SAVE_FILE_AS'
};

const Toolbar = ({ currentFilename,
                   lang,
                   /*viewMode,*/
                   /*zoom,*/
                   onClickOpen,
                   onClickSaveAs,
                   onClickLang/*, onClickGraph, onClickList, onChangeZoom*/ }) => (
  <nav className='navbar navbar-default' style={{marginBottom:0}}>
    <div className='container-fluid'>
      <div className='navbar-header'>
        <a className='navbar-brand' href='#'>{currentFilename !== '' ? path.basename(currentFilename) : 'New Graph'}</a>
      </div>
      <button type='button' className='btn btn-default btn-sm navbar-btn' onClick={onClickOpen}>
        <span className='glyphicon glyphicon-folder-open' />
      </button>
      <button type='button' className='btn btn-default btn-sm navbar-btn' style={{marginLeft:10}} onClick={onClickSaveAs}>
        <span className='glyphicon glyphicon-floppy-disk' />
      </button>
      <ul className='nav navbar-nav navbar-right'>
        <li style={{marginRight:'10px'}}> {/*HACK: why do we need to add this margin?*/}
          <div className='btn-group'>
            {languages.map(l => (
              <button key={l}
                      onClick={lang === l ? null : () => onClickLang(l)}
                      className={'btn btn-sm navbar-btn btn-default' + (lang === l ? ' active' : '' )}>
                {l}
              </button>
            ))}
          </div>
        </li>
        {/* //HACK: disable graph view for prototype
        {viewMode===viewModes.GRAPH ?
          <li>
            <form className='navbar-form navbar-left' role="search">
              <div className='form-group'>
                <span style={{marginRight: 10}}>Zoom</span>
                <input
                  className='form-control'
                  type='range'
                  value={zoom}
                  min={0.01}
                  max={1}
                  step={0.01} //TODO: probably want a js component with nonlinear step
                  onChange={e => onChangeZoom(e.target.value) } />
              </div>
            </form>
          </li>
          : ''
        }
        <li style={{marginRight:'10px'}}>{/*HACK: why do we need to add this margin?*}*}
        <div className='btn-group'>
          <button
            className={'btn btn-sm navbar-btn btn-default' + (viewMode === 'GRAPH' ? ' active' : '' )}
            onClick={onClickGraph}>
            Graph
          </button>
          <button
            className={'btn btn-sm navbar-btn btn-default' + (viewMode === 'LIST' ? ' active' : '' )}
            onClick={onClickList}>
            List
          </button>
        </div>
      */}
      </ul>
    </div>
  </nav>
);

const mapStateToProps = state => {
  return {
    currentFilename: state.get('currentFilename'),
    viewMode: state.get('viewMode'),
    lang: state.get('lang'),
    zoom: state.get('zoom')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeZoom: zoom => {
      dispatch({
        type: actionTypes.SET_ZOOM,
        zoom
      });
    },
    onClickLang: lang => {
      dispatch({
        type: actionTypes.SET_LANG,
        lang
      });
    },
    onClickGraph: () => {
      dispatch({
        type: actionTypes.SET_VIEW_MODE,
        viewMode: viewModes.GRAPH
      });
    },
    onClickList: () => {
      dispatch({
        type: actionTypes.SET_VIEW_MODE,
        viewMode: viewModes.LIST
      });
    },
    onClickOpen: () => {
      remote.dialog.showOpenDialog({
        title: 'Select a JSON file',
        filters: [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      }, (filenames) => {
        if(filenames) {
          dispatch({
            type: actionTypes.OPEN_FILE,
            filename: filenames[0]
          });
        }
      });
    },
    onClickSaveAs: () => {
      remote.dialog.showSaveDialog({
        title: 'Select a JSON file',
        filters: [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }, (filename) => {
        if(filename) {
          dispatch({
            type: actionTypes.SAVE_FILE_AS,
            filename
          });
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
