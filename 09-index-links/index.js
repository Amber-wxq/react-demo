import React from 'react';
import {render} from 'react-dom';
import App from './modules/App';
import{Router,Route,hashHistory,IndexRoute} from 'react-router';
import createBrowserHistory  from 'history/lib/createBrowserHistory';
import About from './modules/About';
import Repos from './modules/Repos';
import Repo from './modules/Repo';
import Home from './modules/Home';

render((
    <Router history={hashHistory}>
        <Route path="/" component={App} >
        <IndexRoute component={Home} /> 
            <Route path="/about" component={About} />
            <Route path="/repos" component={Repos} >
                <Route path="/repos/:userName/:repoName" component={Repo} />
            </Route>
          
        </ Route>
    </Router>
)


, document.getElementById('app'));
