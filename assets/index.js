import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/app';
import { PubkeeperProvider } from '../providers/pubkeeper';

render((<PubkeeperProvider><BrowserRouter><App /></BrowserRouter></PubkeeperProvider>), document.getElementById('app'));
