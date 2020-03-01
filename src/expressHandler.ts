import { logger } from './utils/logger'

const express = require('express')
const path = require('path')
const app = express();
const server = require('http').Server(app);
const socketServer = require('socket.io')(server);

app.use( '/' , express.static(path.join(__dirname ,'..')))
server.listen(80);

server.on('connection', () => {
    app.get('/', (req: any, res: any) => {
      console.log(req.params)
      res.send('Access REST api by calling /state, queries: ?full  and ?path=the/tree/of/our/ember')
    })
    .get('/state', (req: any, res: any) => {
      console.log('Query : ', req.query)
      if (typeof(req.query.full)!=='undefined') {
        res.json(global.emberStore)
      } else if (typeof(req.query.path) !== 'undefined') {
        let pathArray = req.query.path.split('/')
        let test = resolveObjectFromArray(global.emberStore, pathArray, 0)
        res.json(test)
      }
    })
  })
  
socketServer.on('connection', ((socket: any) => {
      logger.info('Client connected :' + String(socket.client.id), {})
      // global.mainThreadHandler.socketServerHandlers(socket)
    })
)

const resolveObjectFromArray = (sourceObject: any, referenceArray: [string], index: number): any => {
  let child = sourceObject[referenceArray[index]]
  if (index < referenceArray.length - 1) {
    return resolveObjectFromArray(child, referenceArray, index + 1)
  } else {
    return child
  }
}

export const expressInit = () => {
    logger.info('Initialising WebServer')
}

export { socketServer }