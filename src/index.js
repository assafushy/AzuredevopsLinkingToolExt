import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DragAndDropPage from './DragAndDropPage';
import registerServiceWorker from './registerServiceWorker';


  ReactDOM.render(<DragAndDropPage />, document.getElementById('root'));
  registerServiceWorker();