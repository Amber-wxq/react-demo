import React from 'react';
import {render} from 'react-dom';
import App from './modules/App';
import{Router,Route,hashHistory,IndexRoute,browserHistory} from 'react-router';
import createBrowserHistory  from 'history/lib/createBrowserHistory';
import About from './modules/About';
import Repos from './modules/Repos';
import Repo from './modules/Repo';
import Home from './modules/Home';
import routes from './modules/routes'

render((
    <Router routes={routes} history={browserHistory}>
        
    </Router>
)


, document.getElementById('app'));
