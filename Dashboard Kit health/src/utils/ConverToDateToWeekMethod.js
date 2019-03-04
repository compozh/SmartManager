export default function ConvertToDayToWeek(date){
        var day=  new Date(date).getDay();
            switch (day) {
            case 1:
                return 'Пн'
                break;
            case 2:
                return 'Вт'
                break;
            case 3:
                return 'Ср'
                break;
            case 4:
                return 'Чт'
                break;
            case 5:
                return 'Пт'
                break;
            case 6:
                return 'Сб'
                break;
            case 0:
                return 'Вс'
                break;
            default:
                return 'не известная дата'
                break;
            }
        
}
