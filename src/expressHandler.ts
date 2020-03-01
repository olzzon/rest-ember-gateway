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
      console.log(req)
      res.json(global.emberStore)
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