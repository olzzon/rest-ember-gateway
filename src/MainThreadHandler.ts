import { expressInit } from './utils/expressHandler'
import { EmberClientConnection } from './utils/EmberClientConnection'
import { EmberServerConnection } from './utils/EmberServerConnection'
const processArgs = require('minimist')(process.argv.slice(2))

import { logger } from './utils/logger';

export class MainThreadHandlers {

    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        // Start Ember Server
        if (!process.env.emberIp && !processArgs.emberIp) {
            global.emberServerConnection = new EmberServerConnection()
        }
        // If an IP adress is parsed it starts as a Client
        global.emberClientConnection = new EmberClientConnection()
        expressInit()
    }
}