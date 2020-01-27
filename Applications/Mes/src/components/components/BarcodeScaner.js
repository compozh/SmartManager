import { eventBus } from '../../main';
import { events } from '../../constants';

export default class BarcodeScaner {
    constructor() {
        this.timeoutHandler = 0
        this.inputString = ''
        this.charToUpper = false
    }

    initialize() {
        var me = this
        document.addEventListener('keyup', event => me.onKeyup(event))
    }

    onKeyup(event) {
        if(!('which' in event)) {
            return
        }
        
        var me = this
        if (me.timeoutHandler) {
            clearTimeout(me.timeoutHandler)
        }
        switch(event.which) {
            case 16:
                me.charToUpper = true;
                break;
            case 13:
                me.handleInputEvent()
                return
            case 0:
                break;
            default:
                var code = event.key && event.key.length > 1 ? '' : event.key
                if(event.which >= 65 && event.which <= 90) {
                    code = String.fromCharCode(event.which)
                }
                if(me.charToUpper) {
                    switch(event.key) {
                        case '=':
                            code = '+'
                            break
                        case '-':
                            code = '_'
                            break
                    }
                } else {
                    code = code.toLocaleLowerCase()
                }
                me.charToUpper = false
                me.inputString += code
                break
        }

        me.timeoutHandler = setTimeout(() => me.handleInputEvent(), 20)
    }

    handleInputEvent() {
        if (this.inputString.length <= 3) {
            this.inputString = ''
            return
        }

        eventBus.$emit(events.scannedBarCode, this.inputString)

        this.inputString = ''
    }
}
