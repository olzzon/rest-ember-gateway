import { expressInit } from './utils/expressHandler'
import { EmberClientConnection } from './utils/EmberClientConnection'
import { EmberServerConnection } from './utils/EmberServerConnection'
const processArgs = require('minimist')(process.argv.slice(2))

import { logger } from './utils/logger';

export class MainThreadHandlers {

    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        if (!process.env.emberIp && !processArgs.emberIp) {
            // Start Ember Server if no emberIp is added:
            global.emberServerConnection = new EmberServerConnection()
            this.waitForServer()
        } else {
            // If an IP adress is parsed it starts as a Ember Client otherwise it starts as a local client:
            global.emberClientConnection = new EmberClientConnection()
            expressInit()
        }
    }

    waitForServer () {
        if(!global.emberServerReady) {
            console.log('waiting for Ember Server start');
            let NextTimerRef = setTimeout(() => { 
                this.waitForServer() 
            }, 100)
        } else {
            console.log('Ember server started')
            global.emberClientConnection = new EmberClientConnection()
            expressInit()
        }
    }
}