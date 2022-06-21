import '../node_modules/bootstrap/dist/css/bootstrap.css'

import {css} from 'lit'

let styles = () => {
    let { cssRules } = Array.from(document.styleSheets)
        .filter(a => a.href.indexOf('lit.css')>=0 )[0]
        || {}

    if (!cssRules) return []

    let a = cssRules && css([
        Object.values(cssRules)
        .map(rule => rule.cssText)
        .join('\n')
    ])

    return [a]
}

export let webLitStyles = styles()