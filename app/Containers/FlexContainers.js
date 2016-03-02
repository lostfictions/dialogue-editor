import React from 'react';

export const FlexFullColumn = ({ direction = 'column', children }) => (
  <div style={{display: 'flex', flexDirection: direction, height: '100%', width: '100%'}}>
    {children}
  </div>
);

export const FlexGrowInner = ({ children }) => (
  <div style={{flex: '1', overflow: 'auto', position: 'relative'}}>
    <div style={{width:'100%', height:'100%', position:'absolute'}}>
      {children}
    </div>
  </div>
);
