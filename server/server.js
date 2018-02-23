import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import model from './model'
// require.extensions['.png'] = () => {}
import csshook from 'css-modules-require-hook/preset'

// require('css-modules-require-hook')({
//   generateScopedName: '[name]__[local]___[hash:base64:5]'
// });

// reqyure
import assetHook from 'asset-require-hook'

assetHook({
    extensions: ['png'],
    limit: 8000
})
// require('asset-require-hook')({
//     extensions: ['png'],
//     limit: 8000
// })
// require('asset-require-hook')({
//     extensions: ['ttf','woff','svg','eot','woff2'],
//     limit: 10000
// });
import {renderToString,renderToNodeStream} from 'react-dom/server'
import React from 'react'
import {Provider} from 'react-redux'
import App from '../src/app.js'
import {StaticRouter} from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from '../src/reducer'
import thunk from 'redux-thunk'
import staticPath from '../build/asset-manifest.json'
import axios from 'axios'
import {loadData} from '../src/redux/user.redux'
// console.log(staticPath)
// function App(){
// 	return <h2>server side App</h2>
// }


// console.log(renderToString())
const Chat = model.getModel('chat')

const app = express()
// work with express
const server = require('http').Server(app)

const io = require('socket.io')(server)

io.on('connection',function(socket){
	// console.log('user login')
	socket.on('sendmsg',function(data){
		// console.log(data)
		const {from, to, msg} = data
		const chatid = [from,to].sort().join('_')
		Chat.create({chatid,from,to,content:msg},function(err,doc){
			io.emit('recvmsg', Object.assign({},doc._doc))
		})
		// console.log(data)
		// io.emit('recvmsg',data)
	})
})

const userRouter = require('./user')
var path = require('path');
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user',userRouter)
app.use(function(req,res,next){
	// for(let key in req)
	// console.log(req.domain)
	// console.log(req.baseUrl)
	// console.log(req.originalUrl)
	// console.log(Object.keys(req))
	if(req.url.startsWith('/user/') || req.url.startsWith('/static/')){
			return next()
	}
	// return res.sendFile(path.resolve('build/index.html'));
	// console.log(require(''))
	const context = {}
	const store = createStore(reducers, compose(
		applyMiddleware(thunk),
	))
		
		// axios.get(req.headers.host+'/user/info')
		// 	.then(res=>{
		// 		console.log(res)
		// 		if (res.status==200 && res.data.code==0) {
						
		// 				store.dispatch(loadData(res.data.data))
		// 				console.log(store.getState())

		// 		}
		// 	})
	// console.log('xx2')
	// const markupStream = renderToNodeStream(
	// 	(<Provider store={store}>
	// 		<StaticRouter
	// 			location={req.url}
	// 	    context={context}
	//    >
	// 			<App></App>
	// 		</StaticRouter>
	// 	</Provider>)
	// )
	const markup = renderToString(
		(<Provider store={store}>
			<StaticRouter
				location={req.url}
		    context={context}
	   >
				<App></App>
			</StaticRouter>
		</Provider>)
	)
// 	res.write(`<!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
//     <meta name="theme-color" content="#000000">
//     <link rel="stylesheet" href="/${staticPath['main.css']}">
//     <meta name="description" content="React开发招聘 App" />
//     <meta name="keywords" content="React,Redux,SSR,React-router,Socket.io" />
//     <meta name="author" content="Imooc" >
//     <title>Redux+React Router+Node.js全栈开发聊天App</title>

//   </head>
//   <body>
//     <noscript>
//       You need to enable JavaScript to run this app.
//     </noscript>
//     <div id="root">`)
	// console.log('xx1')
	// markupStream.pipe(res, { end: false });
 //  markupStream.on('end', () => {
	// 	console.log('xx')
 //    res.write(`
	// 		</div>
	// 		    <script src="/${staticPath['main.js']}"></script>
	// 		  </body>
	// 		</html>
 //    `);
 //    res.end();
 //  });
	
	const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="/${staticPath['main.css']}">
    <meta name="description" content="React开发招聘 App" />
    <meta name="keywords" content="React,Redux,SSR,React-router,Socket.io" />
    <meta name="author" content="Imooc" >
    <title>Redux+React Router+Node.js全栈开发聊天App</title>

  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root">${markup}</div>
    <script src="/${staticPath['main.js']}"></script>
  </body>
</html>

	`
	return res.send(page)
})
// app.use(express.static('build'))
app.use('/', express.static(path.resolve('build')))
server.listen(9093,function(){
	console.log('Node app start at port 9093')
})



