  /* Renderless компонент без отрисовки */
export default {
    name: 'renderless',
    props: ['value'],
    data() {
        return {
            curentDocument: '',
        }
      },
    methods: {
        transferToDocument(doc){
            this.curentDocument = doc;
            this.$emit('input', doc);
        },
    },
    render(){
        return this.$scopedSlots.default({
            task: this.value,
            curentDocument: this.curentDocument,
            transferToDocument: this.transferToDocument,
        })
    },
    inputEvents: {
        input: (e) => { this.curentDocument = e.target.value },
    }
}