import { socketServer } from './expressHandler'
import { EmberClientConnection } from './utils/EmberClientConnection'
import { EmberServerConnection } from './utils/EmberServerConnection'
const processArgs = require('minimist')(process.argv.slice(2))

import { logger } from './utils/logger';

export class MainThreadHandlers {
    emberConnection: EmberClientConnection | EmberServerConnection

    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        // If an IP adress is parsed it starts as a Client
        // If not it starts as Server
        if (process.env.emberIp || processArgs.emberIp) {
            this.emberConnection = new EmberClientConnection()
        } else {
            this.emberConnection = new EmberServerConnection()
        }
        /*
        store.dispatch({
            type:UPDATE_SETTINGS,
            settings: loadState(state)
        });
        */
    }
}