import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import RouteMap from './router';
import registerServiceWorker from './registerServiceWorker';

const render = (Component) => (
	<BrowserRouter>
		<Component />	
	</BrowserRouter>
)
const App = render(RouteMap)
ReactDOM.hydrate(App, document.getElementById('root'));
registerServiceWorker();
