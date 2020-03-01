import { logger } from './utils/logger'
import { MainThreadHandlers } from 'MainThreadHandler';

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
        global.mainThreadHandler.emberConnection.updatePath(req.query.path)
        .then(()=>{
          let pathArray = req.query.path.split('/')
          let test = global.mainThreadHandler.emberConnection.getObjectFromArray(global.emberStore, pathArray, 0)
          res.json(test)
        })
      }
    })
    .post('/setvalue', (req: any, res: any) => {
      console.log('Query : ', req.query)
      if (typeof(req.query.path) !== 'undefined') {
        global.mainThreadHandler.emberConnection.setValue(req.query.path, req.query.value)
        res.send('Value Changed')
    }
    })
  })
  
socketServer.on('connection', ((socket: any) => {
      logger.info('Client connected :' + String(socket.client.id), {})
      // global.mainThreadHandler.socketServerHandlers(socket)
    })
)

export const expressInit = () => {
    logger.info('Initialising WebServer')
}

export { socketServer }