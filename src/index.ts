import { MainThreadHandlers } from './MainThreadHandler'

declare global {
  namespace NodeJS {
      interface Global {
          mainThreadHandler: MainThreadHandlers
          emberClientStore: any
      }
  }
}

global.mainThreadHandler = new MainThreadHandlers()