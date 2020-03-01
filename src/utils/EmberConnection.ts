//@ts-ignore
import { EmberClient } from 'node-emberplus'
import { logger } from './logger'
const processArgs = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')

const {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    JSONSchemaStore 
  } = require("quicktype-core");
const emberIp = process.env.emberIp || processArgs.emberIp || "0.0.0.0"
const emberPort = process.env.emberPort || processArgs.emberPort || "9000"

export class EmberMixerConnection {
    emberConnection: EmberClient

    constructor() {
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
        this.emberConnection.connect()
        .then(() => {
            console.log("Getting Directory")
            return this.emberConnection.getDirectory();
        })
        .then((r: any) => {
            this.emberConnection.expand(r.elements[0])
            .then(() => {
                this.dumpEmberTree(this.emberConnection.root)
                this.convertRootToObject(this.emberConnection.root)
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

    convertRootToObject(root: any): any {
        let rootObj = JSON.parse(JSON.stringify(root))
        global.emberStore = this.convertChildToObject(rootObj.elements[0])
        console.log('Device Object :', global.emberStore)
        logger.info('Tree converted to object')
    }

    convertChildToObject(node: any): any {
        if (node.children) {
            let childNode: any = {}
            node.children.forEach((item: any) => {
                let temp = this.convertChildToObject(item)
                childNode[item.identifier] = temp
            })
            return childNode
        } else {
            return node
        }
    }

    setupMixerConnection() {
        logger.info('Ember connection established - setting up subscription of channels')
    }
}
