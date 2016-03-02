import React from 'react';
import Toolbar from '../Components/Toolbar';
import MainView from '../Components/MainView';
import { FlexFullColumn, FlexGrowInner } from './FlexContainers';
import DevToolsWrapper from './DevToolsWrapper';

const App = () => (
  <FlexFullColumn>
    <Toolbar />
    <FlexGrowInner>
      <MainView />
    </FlexGrowInner>
    <DevToolsWrapper />
  </FlexFullColumn>
);

export default App;
