export default function UnionServiseParam(PerfExceedanseParams,serverParams){
    var data = [];
    for(var key in PerfExceedanseParams) {
      for(var key2 in PerfExceedanseParams[key]){
        data[serverParams[key].ServerName + PerfExceedanseParams[key][key2].Date] = data[serverParams[key].ServerName + PerfExceedanseParams[key][key2].Date]|| Object.assign({},serverParams[key]);  
        data[serverParams[key].ServerName + PerfExceedanseParams[key][key2].Date][PerfExceedanseParams[key][key2].Name] = {v: PerfExceedanseParams[key][key2].Value, m:PerfExceedanseParams[key][key2].MetricLevel}
        data[serverParams[key].ServerName + PerfExceedanseParams[key][key2].Date].Date = PerfExceedanseParams[key][key2].Date
      }
    }
    return data;
}