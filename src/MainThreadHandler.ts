import { store, state } from './reducers/store'
import { socketServer } from './expressHandler'
import { EmberMixerConnection } from './utils/EmberConnection'

import { 
    loadState, 
} from './utils/SettingsStorage'

import { logger } from './utils/logger';
const path = require('path')

export class MainThreadHandlers {
    emberConnection: EmberMixerConnection
    
    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        this.emberConnection = new EmberMixerConnection()
        /*
        store.dispatch({
            type:UPDATE_SETTINGS,
            settings: loadState(state)
        });
        */
    }
}