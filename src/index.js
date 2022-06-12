// npm install
// deno bundle src/_mod.js src/mod.js
// npx esbuild --bundle src/index.js --sourcemap --outfile=web-lit.js --format=esm --minify --watch

export * from './mod.js'

export * from './styles.js'

export * from './web-element.js'

export { LitElement, html, css, render } from 'lit'