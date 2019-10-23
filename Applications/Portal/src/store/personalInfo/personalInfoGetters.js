
export default {
  getEmployeeInfo: state => {
    if (state.employeeInfo) {
      return state.employeeInfo
    }
    return undefined
  }
}  
