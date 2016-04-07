import React from 'react';

import { columnWidth, columnMargin } from '../Constants';

const ColumnsContainer = ({ children }) => (
  <div style={{
    position:'relative',
    display:'block',
    height:'100%',
    width:'100%',
    overflowX:'auto',
    overflowY:'hidden'}}>
    <div style={{
      width:React.Children.count(children) * (columnWidth + columnMargin),
      height:'100%'
    }}>
      {children}
    </div>
  </div>
);

export default ColumnsContainer;
