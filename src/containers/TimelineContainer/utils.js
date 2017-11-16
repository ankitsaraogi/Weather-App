
export function bucketTimeIntoDays(data, key) {
    
    let bucketdata = {};
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (let i = 0;i < data.length; i++) {
      let date = data[i][key] < 10000000000 ? data[i][key] * 1000 : data[i][key];
      date = new Date(date);
      let dayName = days[date.getDay()];
      if (bucketdata[dayName]) {
        bucketdata[dayName].push(data[i]);
      }
      else {
        bucketdata[dayName] = [];
        bucketdata[dayName].push(data[i]);
      }
    }
    
    return bucketdata;
}