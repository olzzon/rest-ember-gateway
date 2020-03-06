//@ts-ignore
import { EmberServer } from 'node-emberplus'
const {ParameterType, FunctionArgument} = require("node-emberplus").EmberLib

import { logger } from './logger'
const fs = require('fs')
const path = require('path')

export class EmberServerConnection {
    emberConnection: EmberServer

    constructor() {
        logger.info("Setting up Ember Server")
        let root = this.createEmberTree()
        this.emberConnection = new EmberServer(
            '0.0.0.0',
            global.emberPort,
            root
        );

        this.emberConnection
        .on('event', (event: any) => {
            console.log('Event received : ', event)
        })
        .on('error', (error: any) => {
			if (
				(error.message + '').match(/econnrefused/i) ||
				(error.message + '').match(/disconnected/i)
			) {
				logger.error('Ember connection not establised')
			} else {
				logger.error('Ember connection unknown error' + error.message)
			}
        })
        .on('disconnected', () => {
            logger.error('Lost Ember connection')
		})
        logger.info('Setting up Ember Server')

        this.emberConnection.listen()
        .then(() => { 
            global.emberServerReady = true
            console.log("Ember Server is listening"); 
        })
        .catch((error: Error) => { 
            
            console.log(error.stack); 
        });
    }

    createEmberTree() {
        if (!fs.existsSync(path.resolve('storage', global.emberFile))){
            logger.error('Missing ' + global.emberFile + ' file in storage folder')
        }
        logger.info('Reading EmberTree form file')
        let treeJson = JSON.parse(fs.readFileSync(path.resolve('storage', global.emberFile), (error: Error)=>{
            if (error) {
                console.log(error)
                logger.error('Error reading Ember file')
            }
        }))
        console.log('Ember Tree :', treeJson)
        return EmberServer.JSONtoTree(treeJson)
    }
}

