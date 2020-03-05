import { logger } from './logger'
import { getState  } from '../APIHandlers/getState'
import { setValue  } from '../APIHandlers/setValue'
import { setMatrix } from '../APIHandlers/setMatrix'


const express = require('express')
const path = require('path')
const app = express();
const server = require('http').Server(app);
const socketServer = require('socket.io')(server);

export const expressInit = () => {
    logger.info('Initialising WebServer')
    app.use( '/' , express.static(path.join(__dirname ,'..')))
    server.listen(80)
    server.on('connection', () => {
        app.get('/', (req: any, res: any) => {
            console.log(req.params)
            res.send('Access REST api by calling /state, queries: ?full  and ?path=the/tree/of/our/ember')
        })
        .get('/state', (req: any, res: any) => {
            getState(req, res)
        })
        .post('/setvalue', (req: any, res: any) => {
            setValue(req, res)
        })
        .post('/setmatrix', (req: any, res: any) => {
          setMatrix(req, res)
      })
    })

    socketServer.on('connection', ((socket: any) => {
        logger.info('Client connected :' + String(socket.client.id), {})
        // global.mainThreadHandler.socketServerHandlers(socket)
      })
    )
}

export { socketServer }