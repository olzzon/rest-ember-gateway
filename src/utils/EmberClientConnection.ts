//@ts-ignore
import { EmberClient } from 'node-emberplus'
import { logger } from './logger'
const fs = require('fs')
const path = require('path')

export class EmberClientConnection {
    client: EmberClient

    constructor() {
        logger.info("Setting up Ember Client Connection")
        this.client = new EmberClient(
            global.emberIp,
            global.emberPort
        );

        this.client.on('error', (error: any) => {
			if (
				(error.message + '').match(/econnrefused/i) ||
				(error.message + '').match(/disconnected/i)
			) {
				logger.error('Ember connection not establised')
			} else {
				logger.error('Ember connection unknown error' + error.message)
			}
        })
        this.client.on('disconnected', () => {
            logger.error('Lost Ember connection')
		})
        logger.info('Connecting to Ember')
        this.client.connect()
        .then(() => {
            logger.info("Getting Directory")
            return this.client.getDirectory();
        })
        .then((r: any) => {
            if (global.emberDump) {
                logger.info('Expanding Tree')
                this.client.expand(r.elements[0])
                .then(() => {
                    this.convertRootToObject(this.client.root)
                    this.dumpEmberTree(this.client.root)
                })
            }
        })
        .catch((e: any) => {
            logger.error(e.stack);
        });
    }

    dumpEmberTree(root: any) {
        let json = JSON.stringify(JSON.parse(JSON.stringify(root)).elements)
        if (!fs.existsSync(path.resolve('storage', global.emberFile))){
            fs.mkdirSync('storage')
            logger.error('Missing embertree.json file in storage folder')
        }
        logger.info('Writing EmberTree to file')
        fs.writeFile(path.resolve('storage', global.emberFile), json, 'utf8', (error: Error)=>{
            if(error) {
                console.log(error)
                logger.error('Error writing Ember-dump file')
            }
        })
    }

    convertRootToObject(root: any): any {
        let rootObj = JSON.parse(JSON.stringify(root))
        global.emberClientStore={}
        global.emberClientStore[rootObj.elements[0].identifier] = this.convertChildToObject(rootObj.elements[0])
        console.log('Device Object :', global.emberClientStore)
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
        const element = await this.client.getElementByPath(path)
        await this.client.setValueNoAck(element, value)
        await this.updatePath(path)
        return true
    }

    async updatePath(path: string): Promise<any> {
        const element = await this.client.getElementByPath(path)
        //let pathArray = path.split('/')
        //this.updateObjectFromArray(global.emberClientStore, element, pathArray, 0)
        return element
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

