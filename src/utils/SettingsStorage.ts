// Node Modules:
const fs = require('fs')
const path = require('path')
import { store } from '../reducers/store'

// Redux:
import { logger } from './logger'

export const loadState = (storeRedux: any) => {
    let settingsInterface = storeRedux.settings[0]
    try {
        return (JSON.parse(fs.readFileSync(path.resolve('storage', 'settings.json'))))
    }
    catch (error) {
        logger.error('Couldn´t read Settings.json file, creating af new', {})
        saveState(settingsInterface)
        return (settingsInterface)
    }
}

export const saveState = (settings: any) => {
    let json = JSON.stringify(settings)
    if (!fs.existsSync('storage')){
        fs.mkdirSync('storage')
    }
    fs.writeFile(path.resolve('storage', 'settings.json'), json, 'utf8', (error: any)=>{
        logger.error('Error writing settings.json file: ', error)
    })
}
