//app/public/src/index.js
import './style/index.css';
import Router from './router';
import registerServiceWorker from './registerServiceWorker';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'


ReactDOM.render(
    <Router />,
    document.getElementById('root')
);
registerServiceWorker();
