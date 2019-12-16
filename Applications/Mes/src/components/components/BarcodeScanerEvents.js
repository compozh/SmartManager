export default class BarcodeScanerEvents {
    
    constructor() {
        this.timeoutHandler = 0
        this.inputString = ''
    }
    
    initialize() {
        var me = this
        document.addEventListener('keyup', event => me.onKeyup(event))
    }

    onKeyup(event) {
        var me = this
        if (me.timeoutHandler) {
            clearTimeout(me.timeoutHandler)
            switch(event.which) {
                case 16:
                case 0:
                case 13:
                    break
                default:
                    me.inputString += event.key
                    break
            }
        } 

        me.timeoutHandler = setTimeout(() => {
            if (me.inputString.length <= 3) {
                me.inputString = ''
                return
            }
            
            var onbarcodescanedEvent = new CustomEvent("onbarcodescaned", {
                detail: { code: me.inputString }
            })
            document.dispatchEvent(onbarcodescanedEvent);

            me.inputString = ''
        }, 20)
    }
}