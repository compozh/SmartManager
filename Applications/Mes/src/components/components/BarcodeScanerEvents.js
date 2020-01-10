export default class BarcodeScanerEvents {

    constructor() {
        this.timeoutHandler = 0
        this.inputString = ''
        this.charToUpper = false
    }

    initialize() {
        var me = this
        document.addEventListener('keyup', event => me.onKeyup(event))
    }

    callBarcodescanedEvent(inputString) {
        var onbarcodescanedEvent = new CustomEvent("onbarcodescaned", {
            detail: { code: inputString }
        })
        document.dispatchEvent(onbarcodescanedEvent);
    }

    onKeyup(event) {
        if(!('which' in event)) {
            return;
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
                var code = event.key && event.key.length > 1 ? event.key : ''
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
        var me = this

        if (me.inputString.length <= 3) {
            me.inputString = ''
            return
        }

        me.callBarcodescanedEvent(me.inputString)
        me.inputString = ''
    }
}
