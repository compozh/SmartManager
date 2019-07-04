export function getIcon(item) {
  if (!item.value && !item.conditionParameter) {
    return {
      icon: '',
      color: ''
    };
  } else if (item.conditionParameter.valueRanges &&
    item.conditionParameter.valueRanges.length) {
    const range = item.conditionParameter.valueRanges.find(r => item.value >= r.minValue &&
      item.value <= r.maxValue);
    return range ?
      range.workRequestCategoryId ?
      range.workRequestCategoryId === '4' ? {
        icon: 'error',
        color: 'red'
      } : {
        icon: 'error_outline',
        color: 'orange'
      } : {
        icon: 'check_circle_outline',
        color: 'green'
      } : {
        icon: 'remove_circle_outline',
        color: 'grey'
      };
  } else {
    if (item.conditionParameter.minValue >= item.conditionParameter.maxValue) {
      return {
        icon: 'remove_circle_outline',
        color: 'grey'
      };
    }
    return item.value < item.conditionParameter.minValue ||
      item.value > item.conditionParameter.maxValue ? {
        icon: 'error',
        color: 'red'
      } : {
        icon: 'check_circle_outline',
        color: 'green'
      };
  }
}