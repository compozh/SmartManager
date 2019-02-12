import _ from 'lodash'
export default function FindMaxValue(arrayElement, maxValue){
    // var t=_.max(arrayElement);
    if(arrayElement>maxValue){
        return '#f55a4e'
    }
    else{
        return '#008FFB'
    }
        // //добавляем 5% к максимальной высоте и округляем до целого
        // return t+(t*0.05);
}