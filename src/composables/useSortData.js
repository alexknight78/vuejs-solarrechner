export function sortData(key, data, sortUpDown) {
  data.sort((a, b) => {
    // console.log('sortUpDown', sortUpDown)
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return sortUpDown === 'up' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
    } else {
      return sortUpDown === 'up' ? a[key] - b[key] : b[key] - a[key]
    }
  })

  return data
}
