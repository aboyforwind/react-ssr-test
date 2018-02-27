import React from 'react'
import { StaticRouter } from 'react-router-dom'

import RouteMap from './router'
const createApp = (context, location) => (
	<StaticRouter context={context} location={location}>
		<RouteMap />
	</StaticRouter>	
)
export default createApp