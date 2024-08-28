export function sortData(key, data, sortUpDown) {
  data.sort((a, b) => {
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return sortUpDown.value ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
    } else {
      return sortUpDown.value ? a[key] - b[key] : b[key] - a[key]
    }
  })

  return data
}
