// deno bundle -r src/_mod.js src/mod.js
export * as Ajax from 'https://raw.githubusercontent.com/kodema5/ajax.js/master/mod.js'

export { pubsub, PubSub }  from 'https://raw.githubusercontent.com/kodema5/pubsub.js/master/mod.js'

export * as worker from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'

import { Store } from 'https://raw.githubusercontent.com/kodema5/store.js/master/mod.js'

// a local store
let store = new Store('web-lit')
store.load()
globalThis.addEventListener('beforeunload', () => store.save())
export { store, Store }