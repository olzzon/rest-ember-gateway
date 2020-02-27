import { store, state } from './reducers/store'
import { socketServer } from './expressHandler'

import { 
    loadState, 
} from './utils/SettingsStorage'

import { logger } from './utils/logger';
const path = require('path')

export class MainThreadHandlers {

    constructor() {
        logger.info('Setting up MainThreadHandlers', {})
        /*
        store.dispatch({
            type:UPDATE_SETTINGS,
            settings: loadState(state)
        });
        */
    }
}