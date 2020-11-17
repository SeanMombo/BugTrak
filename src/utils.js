export function truncateString(str, num) {
    if (typeof str !== 'string') return str;
  
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  

  export function truncateDate(str) {
    let num = 10;
    if (typeof str !== 'string') return str;
  
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num)
  }
   