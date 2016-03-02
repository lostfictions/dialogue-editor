import React from 'react';

const DevToolsWrapper = ({ children }) => (
  <div>
    {children}
    {
      (() => {
        if (process.env.NODE_ENV !== 'production') {
          const DevTools = require('./DevTools');
          return <DevTools />;
        }
      })()
    }
  </div>
);

export default DevToolsWrapper;
