// deno bundle -r src/_mod.js src/mod.js
export * as Ajax from 'https://raw.githubusercontent.com/kodema5/ajax.js/master/mod.js'

export { pubsub, PubSub }  from 'https://raw.githubusercontent.com/kodema5/pubsub.js/master/mod.js'

export * as worker from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'

import { Store } from 'https://raw.githubusercontent.com/kodema5/store.js/master/mod.js'

// a local store
let store = new Store('web-lit')
store.load()

// init ajax-headers
{
    let AJAX_AUTH_ID = 'ajax.headers.Authorization'
    let a = store.get(AJAX_AUTH_ID, null)
    if (a) {
        Ajax.ajax.headers.Authorization = a
    }
}

globalThis.addEventListener('beforeunload', () => store.save())
export { store, Store }