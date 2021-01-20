import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setupConfig } from '@ionic/react';
import * as serviceWorker from './serviceWorker';
setupConfig({
  scrollAssist: false,
});
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
