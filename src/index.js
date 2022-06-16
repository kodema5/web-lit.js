// npm install
// deno bundle src/_mod.js src/mod.js
// npx esbuild --bundle src/index.js --sourcemap --outfile=web-lit.js --format=esm --minify --watch

export * from './mod.js'

export * from './styles.js'

export * from './web-element.js'

export { LitElement, html, css, render } from 'lit'

export { styleMap } from 'lit/directives/style-map.js'

export { ref, createRef} from 'lit/directives/ref.js'

export { unsafeHTML } from 'lit/directives/unsafe-html.js'

export { unsafeSVG } from 'lit/directives/unsafe-svg.js'