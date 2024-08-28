export function loadDataLocalStore(key) {
  const storedDataOfWrs = localStorage.getItem(key)
  if (storedDataOfWrs) {
    return JSON.parse(storedDataOfWrs)
  }
}

export function saveDataLocalStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function clearDataLocalStore(key = '') {
  switch (key) {
    case 'dataOfWrs':
      // dataOfWrs.value = []
      localStorage.removeItem(key)
      break
    case 'dataOfPvs':
      // dataOfPvs.value = []
      localStorage.removeItem(key)
      break
    case 'dataOfWrsPvs':
      // dataOfWrsPvs.value = []
      localStorage.removeItem(key)
      break

    default:
      // dataOfWrs.value = []
      // dataOfPvs.value = []
      // dataOfWrsPvs.value = []
      localStorage.clear()
  }
}
