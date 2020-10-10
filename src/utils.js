export function truncateString(str, num) {
    if (typeof str !== 'string') return str;
  
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  