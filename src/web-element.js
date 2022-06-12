// web-element extends lit.dev's LitElement for web-component
//
import { LitElement } from 'lit'

import { webLitStyles } from './styles.js'

export class WebElement extends LitElement {

    static get styles () {
        return webLitStyles
    }
}

