//@ts-ignore
import { EmberClient } from 'node-emberplus'
import { logger } from './logger'
const processArgs = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')

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
            this.emberConnection.expand(r.elements[0])
            .then(() => {
                this.deviceRoot = this.emberConnection.root;
                this.dumpEmberTree(this.deviceRoot)
                this.setupMixerConnection();
            })
        })
        .catch((e: any) => {
            console.log(e.stack);
        });
    }

    dumpEmberTree(root: any) {
        let json = JSON.stringify(root)
        if (!fs.existsSync('storage')){
            fs.mkdirSync('storage')
        }
        logger.info('Writing EmberTree to file')
        fs.writeFile(path.resolve('storage', 'embertree.json'), json, 'utf8', (error: any)=>{
            console.log(error)
            logger.error('Error writing Ember-dump file')
        })
    }

    setupMixerConnection() {
        logger.info('Ember connection established - setting up subscription of channels')
    }
}

