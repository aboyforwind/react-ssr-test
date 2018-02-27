import React from 'react'
import { Route, Switch } from 'react-router-dom'

import App from './client/App'
import List from './client/list'

const RouteMap = () => (
	<Switch>
		<Route path='/' component={App} key='app' exact />
		<Route path='/list' component={List} key='list' />
	</Switch>
)

export default RouteMap