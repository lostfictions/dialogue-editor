import React from 'react';
import { connect } from 'react-redux';

import GraphView from './GraphView';
// import Nav from './Nav';

import { ColumnsContainer } from '../Containers/ListView';

import QuestionsColumn from './Columns/QuestionsColumn';
import ClipsColumn from './Columns/ClipsColumn';


const MainView = ({ viewMode }) => {
  let view;
  switch(viewMode) {
    case 'GRAPH':
      view = <div><GraphView />{/*<Nav />*/}</div>;
      break;
    case 'LIST':
      view = (<ColumnsContainer>
                <QuestionsColumn />
                <ClipsColumn />
              </ColumnsContainer>);
      break;
    default:
      throw new Error('Unexpected view mode: ' + viewMode);
  }
  return view;
};

const mapStateToProps = state => {
  return {
    viewMode: state.get('viewMode')
  };
};

export default connect(mapStateToProps)(MainView);
