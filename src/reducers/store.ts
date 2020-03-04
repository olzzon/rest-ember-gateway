import { createStore } from 'redux'
import indexReducer from './indexReducer'

let storeRedux = createStore(
    indexReducer
)

/*
storeRedux.dispatch({
    type:UPDATE_SETTINGS,
    settings: loadState(storeRedux.getState())
})
*/

//Subscribe to redux store:
let state = storeRedux.getState()
const unsubscribe = storeRedux.subscribe(() => {
    state = storeRedux.getState()
})

export { storeRedux as store }
export { state }