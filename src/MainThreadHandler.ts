import { socketServer } from './expressHandler'
import { EmberClientConnection } from './utils/EmberClientConnection'
import { EmberServerConnection } from './utils/EmberServerConnection'
const processArgs = require('minimist')(process.argv.slice(2))

import { logger } from './utils/logger';

export class MainThreadHandlers {
    emberClientConnection: EmberClientConnection 
    emberServerConnection: EmberServerConnection

    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        // Start Ember Server
        if (!process.env.emberIp && !processArgs.emberIp) {
            this.emberServerConnection = new EmberServerConnection()
        }
        // If an IP adress is parsed it starts as a Client
        this.emberClientConnection = new EmberClientConnection()
        /*
        store.dispatch({
            type:UPDATE_SETTINGS,
            settings: loadState(state)
        });
        */
    }
}