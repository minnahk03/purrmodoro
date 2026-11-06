import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './src/App';
ReactDOM.render(<App load={async()=>JSON.parse(localStorage.getItem('purrmodoro-preview')||'null')} save={async s=>{localStorage.setItem('purrmodoro-preview',JSON.stringify(s));}}/>,document.getElementById('app'));
