//@ts-ignore
import { EmberClient } from 'node-emberplus'
import { logger } from './logger'
const processArgs = require('minimist')(process.argv.slice(2))

const emberIp = process.env.emberIp || processArgs.emberIp || "0.0.0.0"
const emberPort = process.env.emberPort || processArgs.emberPort || "9000"

export class EmberMixerConnection {
    emberConnection: EmberClient
    deviceRoot: any;
    emberNodeObject: Array<any>;


    constructor() {
        this.emberNodeObject = new Array(200);
        
        logger.info("Setting up Ember connection")
        this.emberConnection = new EmberClient(
            emberIp,
            emberPort
        );

        this.emberConnection.on('error', (error: any) => {
			if (
				(error.message + '').match(/econnrefused/i) ||
				(error.message + '').match(/disconnected/i)
			) {
				logger.error('Ember connection not establised')
			} else {
				logger.error('Ember connection unknown error' + error.message)
			}
        })
        this.emberConnection.on('disconnected', () => {
            logger.error('Lost Ember connection')
		})
        logger.info('Connecting to Ember')
        let deviceRoot: any;
        this.emberConnection.connect()
        .then(() => {
            console.log("Getting Directory")
            return this.emberConnection.getDirectory();
        })
        .then((r: any) => {
            console.log("Directory :", r);
            this.deviceRoot = r;
            this.emberConnection.expand(r.elements[0])
            .then(() => {
                this.setupMixerConnection();
            })
        })
        .catch((e: any) => {
            console.log(e.stack);
        });
    }

    setupMixerConnection() {
        logger.info('Ember connection established - setting up subscription of channels')
    }
}

