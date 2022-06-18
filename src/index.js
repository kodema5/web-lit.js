// npm install
// deno bundle -r src/_mod.js src/mod.js
// npx esbuild --bundle src/index.js --sourcemap --outfile=web-lit.js --format=esm --minify --watch


import * as Ajax from '../ajax.js/mod.js'
export { pubsub, PubSub }  from '../pubsub.js/mod.js'
export * as worker from '../waaf.js/mod.js'
import { Store } from '../store.js/mod.js'

// a local store
let store = new Store('web-lit')
store.load()

// init ajax-headers
let AJAX_AUTH_ID = 'ajax.headers.Authorization'
{    let a = store.get(AJAX_AUTH_ID, null)
    if (a) {
        Ajax.ajax.headers.Authorization = a
    }
}

export { Ajax, store, Store }

export * from './styles.js'

export * from './web-element.js'

export { LitElement, html, css, render } from 'lit'

export { styleMap } from 'lit/directives/style-map.js'

export { ref, createRef} from 'lit/directives/ref.js'

export { unsafeHTML } from 'lit/directives/unsafe-html.js'

export { unsafeSVG } from 'lit/directives/unsafe-svg.js'