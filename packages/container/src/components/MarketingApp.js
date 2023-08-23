
import { mount } from 'marketing/MarketingApp';
import React, {useRef, useEffect} from 'react';

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return <div ref={ref}/>;
}

// Compare this snippet from mfp\mfp\packages\container\src\bootstrap.js:
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
//
//