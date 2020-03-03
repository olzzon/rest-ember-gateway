//@ts-ignore
import { EmberServer } from 'node-emberplus'
const {ParameterType, FunctionArgument} = require("node-emberplus").EmberLib

import { logger } from './logger'
const processArgs = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')

const emberPort = process.env.emberPort || processArgs.emberPort || "9000"
const emberFile = process.env.emberFile || processArgs.emberFile || "embertree.json"

export class EmberServerConnection {
    emberConnection: EmberServer

    constructor() {
        logger.info("Setting up Ember Server")
        let root = this.createEmberTree()
        this.emberConnection = new EmberServer(
            '0.0.0.0',
            emberPort,
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
        this.convertRootToObject(this.emberConnection.tree)

        this.emberConnection.listen()
        .then(() => { 
            console.log("listening"); 
        })
        .catch((error: Error) => { 
            console.log(error.stack); 
        });
    }

    createEmberTree() {
        if (!fs.existsSync(path.resolve('storage', emberFile))){
            fs.mkdirSync('storage')
            logger.error('Missing embertree.json file in storage folder')
        }
        logger.info('Reading EmberTree form file')
        let treeJson = JSON.parse(fs.readFileSync(path.resolve('storage', emberFile), (error: Error)=>{
            if (error) {
                console.log(error)
                logger.error('Error reading Ember file')
            }
        }))
        console.log('Ember Tree :', treeJson)
        return EmberServer.JSONtoTree(treeJson)
    }

    convertRootToObject(root: any): any {
        let rootObj = JSON.parse(JSON.stringify(root))
        global.emberStore={}
        global.emberStore[rootObj.elements[0].identifier] = this.convertChildToObject(rootObj.elements[0])
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

    async setValue(path: string, value: any): Promise<any> {
        //const element = await this.emberConnection.getElementByPath(path)
        //await this.emberConnection.setValue(element, value)
        //await this.updatePath(path)
        //return true
    }

    async updatePath(path: string): Promise<any> {
        const element = await this.emberConnection.getElementByPath(path)
        let pathArray = path.split('/')
        this.updateObjectFromArray(global.emberStore, element, pathArray, 0)
        return true
    }

    updateObjectFromArray = (sourceObject: any, updatedElement: any, referenceArray: string[], index: number) => {
        let child = sourceObject[referenceArray[index]]
        if (index < referenceArray.length - 1) {
           this.updateObjectFromArray(child, updatedElement, referenceArray, index + 1)
        } else {
            sourceObject[referenceArray[index]] = updatedElement
        }
    }

    getObjectFromArray = (sourceObject: any, referenceArray: string[], index: number): any => {
        let child = sourceObject[referenceArray[index]]
        if (index < referenceArray.length - 1) {
            return this.getObjectFromArray(child, referenceArray, index + 1)
        } else {
            return child
        }
    }
}

