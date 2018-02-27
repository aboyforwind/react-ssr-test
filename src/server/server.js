process.env.NODE_ENV = 'development';

const express = require('express')
const vm  = require('vm')
const nativeModule = require('module')
const axios = require('axios')
const serverConfig = require('../../config/webpack.server.dev.js')
const webpack = require('webpack')
const MF = require('memory-fs')
const app = express()
const mfs = new MF();
const compiler = webpack(serverConfig);
const path = require('path')
const favicon = require('serve-favicon')
const ReactDomServer =require("react-dom/server")

const httpProxy = require('http-proxy-middleware')
// const App = require('../src/App.js').default
compiler.outputFileSystem = mfs
var bundle
compiler.watch({}, function(error, stats) {
	if(error) throw error
	else {
		stats=stats.toJson();
		stats.errors.forEach(err => console.error(err))
		stats.warnings.forEach(warn => console.error(warn))
	}
	const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
	bundle = mfs.readFileSync(bundlePath,'utf-8');
})
// 将字符串转换成commonjs模块
const getModulefromString = (bundle,filename) => {
  const m = { exports: {} }
  const wrapper = nativeModule.wrap(bundle)
  const script = new vm.Script(wrapper,{
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m

}
// 获取模板内容
const getTemplate = () => {
  return new Promise((resolve, reject) =>{
    axios.get('http://localhost:3000/build/').then((res) => {
     	resolve(res.data)
    }).catch((e) => {
    	console.log(e)
    })
  })
}
app.use(favicon(path.join(__dirname,'../../public/favicon.ico')))
app.use('/build/',httpProxy('http://localhost:3000'))
app.get('*',function(req, res) {
	if(!bundle) {
		res.send('请等待...')
	} else {
		getTemplate().then((template) => {
			console.log(template)
			const bundleModule = getModulefromString(bundle,'server.js')
			var context = {}
			const App = bundleModule.exports.default(context, req.url)
			// 如果有router的跳转
			if(context.url) {
				res.status(302).setHeader(Location, context.url)
				res.end()
				return
			}
			const html = ReactDomServer.renderToString(App)
			// 字符串替换 可以使用ejs或者其他模板来做，
			// 本处为了简单期间，使用了字符串替换
			const a = template.replace('<App />',html)
			res.send(a)
		})
	}
})
app.listen(3002,function(){
	console.log('成功')
})