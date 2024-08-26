<script setup>
import { computed, ref, onMounted } from 'vue'

const dataOfWr = ref({
  wrId: null,
  wrName: '',
  wrNameShort: '',
  wrMinU: null,
  wrMaxU: null,
  wrI: null,
  wrP: null,
  wrMppts: null,
  wrInUse: false,
  mppts: []
})

const dataOfPv = ref({
  pvId: null,
  pvName: '',
  pvWp: null,
  pvVmp: null,
  pvImp: null,
  pvVoc: null,
  pvIk: null,
  pvInUse: false
  // pvMpptId: null
})

const dataOfWrPv = ref({
  id: null,
  dataWr: {},
  dataPv: {}
})

const dataOfWrs = ref([])
const dataOfPvs = ref([])
const dataOfWrsPvs = ref([])

const btnSave = computed(() => {
  return (
    dataOfWr.value.wrName !== '' &&
    dataOfWr.value.wrNameShort !== '' &&
    dataOfWr.value.wrMinU > 0 &&
    dataOfWr.value.wrMaxU > 0 &&
    dataOfWr.value.wrI > 0 &&
    dataOfWr.value.wrP > 0 &&
    dataOfWr.value.wrMppts > 0
  )
})

const btnSavePv = computed(() => {
  return (
    dataOfPv.value.pvName !== '' &&
    dataOfPv.value.pvWp > 0 &&
    dataOfPv.value.pvVmp > 0 &&
    dataOfPv.value.pvImp > 0 &&
    dataOfPv.value.pvVoc > 0 &&
    dataOfPv.value.pvIk > 0
  )
})

const btnSaveWrPv = computed(() => {
  console.log(dataOfWrPv.value.dataPv)
  return (
    Object.keys(dataOfWrPv.value.dataWr).length === 0 ||
    Object.keys(dataOfWrPv.value.dataPv).length === 0
  )
})

const showForm = ref(false)
const showFormPv = ref(false)
const showFormWrPv = ref(false)

const countOfWrs = computed(() => {
  return dataOfWrs.value.length
})

const countOfPvs = computed(() => {
  return dataOfPvs.value.length
})

// select all mppts
const allMpptsOfWrs = computed(() =>
  dataOfWrs.value.flatMap((wr) => {
    return wr.mppts.map((mppt) => {
      return {
        wrId: wr.wrId,
        wrName: wr.wrName,
        wrNameShort: wr.wrNameShort,
        ...mppt
        // pvCount: mppt.pv.length
      }
    })
  })
)

function saveWr() {
  console.log('save wr', dataOfWr.value)
  const setWrId = new Date().getTime()
  const objDataWr = {
    ...dataOfWr.value,
    wrId: setWrId,
    mppts: Array.from({ length: dataOfWr.value.wrMppts }, () => ({
      mpptId: parseFloat(`${setWrId}${Math.floor(Math.random() * 100)}`),
      mpptMinU: dataOfPv.value.wrMinU,
      mpptMaxU: dataOfWr.value.wrMaxU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP,
      pvs: []
    }))
  }
  dataOfWrs.value.push(objDataWr)

  saveDataInLocalStore('dataOfWrs', dataOfWrs.value)

  clearDataOfWr()
  showForm.value = false
}

function updateWr() {
  // console.log('update wr', dataOfWr.value)
  // console.log('wrMppts', dataOfWr.value.wrMppts)
  // console.log('mppts', dataOfWr.value.mppts.length)

  const valMppts = dataOfWr.value.wrMppts
  const arrMppts = dataOfWr.value.mppts.length

  let oldMppts = dataOfWr.value.mppts.map((mppt) => {
    return {
      mpptId: mppt.mpptId,
      mpptMinU: dataOfWr.value.wrMinU,
      mpptMaxU: dataOfWr.value.wrMaxU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP,
      pvs: mppt.pvs
    }
  })

  let newMppts = []

  let setMppts = null

  if (valMppts > arrMppts) {
    newMppts = Array.from({ length: valMppts - arrMppts }, () => ({
      mpptId: parseFloat(`${dataOfWr.value.wrId}${Math.floor(Math.random() * 100)}`),
      mpptMinU: dataOfWr.value.wrMinU,
      mpptMaxU: dataOfWr.value.wrMaxU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP,
      pvs: []
    }))

    setMppts = oldMppts.concat(newMppts)
  } else if (valMppts < arrMppts) {
    setMppts = oldMppts.slice(0, valMppts)
  } else {
    setMppts = oldMppts
  }

  const dataUpdateIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === dataOfWr.value.wrId)
  const objDataWr = {
    ...dataOfWr.value,
    mppts: setMppts
  }

  dataOfWrs.value[dataUpdateIndex] = objDataWr

  saveDataInLocalStore('dataOfWrs', dataOfWrs.value)

  clearDataOfWr()
  showForm.value = false
}

function editWr(editDataWr) {
  console.log(editDataWr)
  dataOfWr.value = {
    ...editDataWr
  }

  showForm.value = true
}

function copyWr(copyDataWr) {
  console.log('clone wr')
  const newWrId = new Date().getTime()
  const objDataWr = {
    ...copyDataWr,
    wrId: newWrId,
    wrInUse: false,
    mppts: copyDataWr.mppts.map((mppt) => {
      return {
        ...mppt,
        mpptId: parseFloat(`${newWrId}${Math.floor(Math.random() * 100)}`)
      }
    })
  }
  dataOfWrs.value.push(objDataWr)

  saveDataInLocalStore('dataOfWrs', dataOfWrs.value)
}

function delWr(delWrId) {
  console.log('delete')

  const dataDeleteIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === delWrId)
  dataOfWrs.value.splice(dataDeleteIndex, 1)
  saveDataInLocalStore('dataOfWrs', dataOfWrs.value)

  // löschen aus WR+PV Liste
  for (let i = dataOfWrsPvs.value.length - 1; i >= 0; i--) {
    if (dataOfWrsPvs.value[i].wrId === delWrId) {
      dataOfWrsPvs.value.splice(i, 1) // Löscht das Element an Index i
    }
  }
  // const index = dataOfWrsPvs.value.findIndex((obj) => obj.wrId === delWrId)
  // console.log(index)
}

function clearDataOfWr() {
  console.log('clear wr form')
  dataOfWr.value.wrInUse = false
  dataOfWr.value.wrId = null
  dataOfWr.value.wrName = ''
  dataOfWr.value.wrNameShort = ''
  dataOfWr.value.wrMinU = ''
  dataOfWr.value.wrMaxU = ''
  dataOfWr.value.wrI = ''
  dataOfWr.value.wrP = ''
  dataOfWr.value.wrMppts = ''
}

function clearDataOfPv() {
  console.log('clear pv form')
  dataOfPv.value.pvId = null
  dataOfPv.value.pvName = ''
  dataOfPv.value.pvWp = null
  dataOfPv.value.pvVmp = null
  dataOfPv.value.pvImp = null
  dataOfPv.value.pvVoc = null
  dataOfPv.value.pvIk = null
}

function clearDataOfWrPv() {
  console.log('clear wr pv form')
  dataOfWrPv.value.id = null
  dataOfWrPv.value.dataWr = {}
  dataOfWrPv.value.dataPv = {}
}

// PV is complete
function savePv() {
  console.log('save pv', dataOfPv.value)
  const objDataPv = {
    ...dataOfPv.value,
    pvId: new Date().getTime()
  }
  dataOfPvs.value.push(objDataPv)

  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)
}

function getPv(editDataPv) {
  console.log('edit pv data', editDataPv)
  dataOfPv.value = {
    ...editDataPv
  }
  showFormPv.value = true
}

function updatePv() {
  console.log('update pv', dataOfPv.value)

  const dataUpdateIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === dataOfPv.value.pvId)
  const objDataPv = {
    ...dataOfPv.value
  }

  dataOfPvs.value[dataUpdateIndex] = objDataPv
  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)
  clearDataOfPv()
  showFormPv.value = false
}

function copyPv(copyDataPv) {
  console.log('clone pv')
  const newPvId = new Date().getTime()
  const objDataPv = {
    ...copyDataPv,
    pvId: newPvId,
    pvInUse: false
  }
  dataOfPvs.value.push(objDataPv)

  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)
}

function delPv(pvId) {
  console.log('delete pv id', pvId)

  const dataDeleteIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === pvId)
  dataOfPvs.value.splice(dataDeleteIndex, 1)
  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)

  // const dataDeleteWrsPvsIndex = dataOfWrsPvs.value.findIndex((obj) => obj.pvId === pvId)
  // dataOfWrsPvs.value.splice(dataDeleteWrsPvsIndex, 1)
  // saveDataInLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
  //
}

// MPPT + PV
function saveWrPv() {
  console.log('save wr+pv', dataOfWrPv)

  // Verknüpfung
  const objDataWrPv = {
    id: new Date().getTime(),
    wrId: dataOfWrPv.value.dataWr.wrId,
    mpptId: dataOfWrPv.value.dataWr.mpptId,
    pvId: dataOfWrPv.value.dataPv.pvId
  }
  dataOfWrsPvs.value.push(objDataWrPv)

  setInUse('pv', dataOfWrPv.value.dataPv.pvId, true)
  setInUse('wr', dataOfWrPv.value.dataWr.wrId, true)

  clearDataOfWrPv()
  saveDataInLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
}

function delWrPv(id) {
  const dataDeleteIndex = dataOfWrsPvs.value.findIndex((obj) => obj.id === id)
  const deletedItem = dataOfWrsPvs.value.splice(dataDeleteIndex, 1)[0]

  // Überprüfen, ob der WR noch andere PV-Anlagen hat
  const wrHasPv = dataOfWrsPvs.value.some((obj) => obj.wrId === deletedItem.wrId)

  if (!wrHasPv) {
    // Wenn keine PVs mehr vorhanden sind, setze den WR-Status auf false
    const wrToUpdate = dataOfWrs.value.find((wr) => wr.wrId === deletedItem.wrId)
    if (wrToUpdate) {
      // wrToUpdate.wrInUse = false
      setInUse('wr', wrToUpdate.wrId, false)
    }
  }

  // PV-Status auf false setzen, wenn die PVId gefunden wird
  if (deletedItem) {
    setInUse('pv', deletedItem.pvId, false)
  }

  if (dataOfWrsPvs.value.length > 0) {
    saveDataInLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
  } else {
    clearDataInLocalStore('dataOfWrsPvs')
  }
}

//
const dataCalculator = computed(() => {
  // console.log(dataOfWrPv.value.dataPv)
  const mpptDataCopy =
    dataOfWrsPvs.value.length > 0 ? JSON.parse(JSON.stringify(dataOfWrs.value)) : []

  dataOfWrsPvs.value.forEach((item) => {
    // Finde das passende MPPT-Objekt in der Kopie
    const mppt = mpptDataCopy
      .find((wr) => wr.wrId === item.wrId)
      .mppts.find((mppt) => mppt.mpptId === item.mpptId)

    // Finde die passende PV-Daten
    const pv = dataOfPvs.value.find((pv) => pv.pvId === item.pvId)

    // Füge die PV-Daten zu dem MPPT in der Kopie hinzu
    if (mppt && pv) {
      const extendedPv = { ...pv, idWrsPvs: item.id }
      mppt.pvs.push(extendedPv)
      // mppt.pvs.push(pv)
    }
  })

  mpptDataCopy.forEach((wr) => {
    wr.mppts.forEach((mppt) => {
      const groupedModules = groupByVoc(mppt.pvs)

      mppt.mpptMaxU10 = mppt.mpptMaxU * 0.9

      const { possibleStrings, notPossibleModules, toManyModules } =
        calculateMaxStringsForAllGroups(groupedModules, mppt)

      mppt.result = {
        possibleStrings,
        notPossibleModules,
        toManyModules
      }
    })
  })

  return mpptDataCopy.filter((item) => item.mppts.some((mppt) => mppt.pvs.length > 0))
})

//chatGPT
// 1. Gruppiere alle Module die beim MPPT angelegt sind nach deren VOC
function groupByVoc(modules) {
  return modules.reduce((acc, module) => {
    const vocKey = module.pvVoc.toString()
    if (!acc[vocKey]) {
      acc[vocKey] = []
    }
    acc[vocKey].push(module)
    return acc
  }, {})
}

// last
function calculateMaxStringsForAllGroups(groupedModules, mppt) {
  const possibleStrings = []
  const notPossibleModules = []
  const toManyModules = []

  for (const vocKey in groupedModules) {
    const modules = groupedModules[vocKey]
    const moduleVoc = parseFloat(vocKey)

    // Überprüfen, ob die Voc des Moduls außerhalb des MPPT-Bereichs liegt
    // mpptMaxU10 = -10%
    if (moduleVoc > mppt.mpptMaxU10 || moduleVoc < mppt.mpptMinU) {
      notPossibleModules.push(...modules)
      continue
    }

    // const maxModulesInString = Math.floor((mppt.mpptMaxU * 0.9) / moduleVoc)
    const maxModulesInString = Math.floor(mppt.mpptMaxU10 / moduleVoc)

    if (modules.length === 0) continue

    // Berechne die Anzahl der Module für den primären String
    let primaryModulesCount = Math.min(maxModulesInString, modules.length)
    let remainingModulesCount = modules.length - primaryModulesCount

    // Prüfen, ob es sinnvoll ist, die Module gleichmäßig aufzuteilen
    if (remainingModulesCount > 0 && remainingModulesCount < primaryModulesCount) {
      // Teile die Module gleichmäßig auf beide Strings auf
      primaryModulesCount = Math.floor(modules.length / 2)
      remainingModulesCount = modules.length - primaryModulesCount
    }

    const primaryModules = modules.slice(0, primaryModulesCount)
    const remainingModules = modules.slice(primaryModulesCount)

    let primaryString = null
    if (primaryModules.length > 0) {
      primaryString = {
        numberOfModules: primaryModulesCount,
        totalVoc: (moduleVoc * primaryModulesCount).toFixed(2),
        totalVmp: primaryModules[0].pvVmp * primaryModulesCount,
        totalImp: primaryModules[0].pvImp,
        totalPower: primaryModules[0].pvWp * primaryModulesCount,
        modules: primaryModules
      }
    }

    let secondaryString = null
    if (remainingModules.length > 0) {
      const secondaryModulesCount = Math.min(maxModulesInString, remainingModules.length)
      const secondaryModules = remainingModules.slice(0, secondaryModulesCount)

      secondaryString = {
        numberOfModules: secondaryModulesCount,
        totalVoc: (moduleVoc * secondaryModulesCount).toFixed(2),
        totalVmp: secondaryModules[0].pvVmp * secondaryModulesCount,
        totalImp: secondaryModules[0].pvImp,
        totalPower: secondaryModules[0].pvWp * secondaryModulesCount,
        modules: secondaryModules
      }

      // Überprüfen, ob nach dem Erstellen von 2 Strings noch Module übrig sind
      const leftoverModules = remainingModules.slice(secondaryModulesCount)
      if (leftoverModules.length > 0) {
        toManyModules.push(...leftoverModules)
      }
    }

    // Prüfe, ob die Strings die gleichen Werte haben, aber nur wenn beide existieren
    let isSame = false
    if (primaryString && secondaryString) {
      isSame =
        primaryString.numberOfModules === secondaryString.numberOfModules &&
        primaryString.totalVoc === secondaryString.totalVoc &&
        primaryString.totalVmp === secondaryString.totalVmp &&
        primaryString.totalImp === secondaryString.totalImp &&
        primaryString.totalPower === secondaryString.totalPower
    }

    // Füge das Ergebnis der möglichen Strings hinzu, nur wenn primaryString existiert
    if (primaryString) {
      possibleStrings.push({
        voc: moduleVoc,
        primaryString: primaryString,
        secondaryString: secondaryString,
        isSame: isSame
      })
    }

    // console.log('remainingModulesCount', remainingModulesCount)
  }

  return { possibleStrings, notPossibleModules, toManyModules }
}

// allgemein
function setInUse(key, id, status) {
  let dataUpdateIndex
  let objData
  switch (key) {
    case 'pv':
      dataUpdateIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === id)

      objData = {
        ...dataOfPvs.value[dataUpdateIndex],
        pvInUse: status
      }
      dataOfPvs.value[dataUpdateIndex] = objData
      saveDataInLocalStore('dataOfPvs', dataOfPvs.value)
      break
    case 'wr':
      dataUpdateIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === id)

      objData = {
        ...dataOfWrs.value[dataUpdateIndex],
        wrInUse: status
      }
      dataOfWrs.value[dataUpdateIndex] = objData
      saveDataInLocalStore('dataOfWrs', dataOfWrs.value)
      break
  }
  return {
    ...key,
    ...id
  }
}

const sortUpDown = ref(true)
function sortData(datakey, key) {
  console.log(datakey, key, sortUpDown.value)
  switch (datakey) {
    case 'dataOfPvs':
      dataOfPvs.value.sort((a, b) =>
        sortUpDown.value ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
      )
      break
    case 'dataOfWrs':
      dataOfWrs.value.sort((a, b) =>
        sortUpDown.value ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
      )
      break
  }

  sortUpDown.value = !sortUpDown.value
}

function saveDataInLocalStore(key, data) {
  console.log('saveDataInLocalStore')
  localStorage.setItem(key, JSON.stringify(data))
}

function clearDataInLocalStore(key = '') {
  switch (key) {
    case 'dataOfWrs':
      dataOfWrs.value = []
      localStorage.removeItem(key)
      break
    case 'dataOfPvs':
      dataOfPvs.value = []
      localStorage.removeItem(key)
      break
    case 'dataOfWrsPvs':
      dataOfWrsPvs.value = []
      localStorage.removeItem(key)
      break

    default:
      dataOfWrs.value = []
      dataOfPvs.value = []
      dataOfWrsPvs.value = []
      localStorage.clear()
  }
}

onMounted(() => {
  const storedDataOfWrs = localStorage.getItem('dataOfWrs')
  if (storedDataOfWrs) {
    dataOfWrs.value = JSON.parse(storedDataOfWrs)
  }

  const storedDataOfPv = localStorage.getItem('dataOfPvs')
  if (storedDataOfPv) {
    dataOfPvs.value = JSON.parse(storedDataOfPv)
    //sortData('dataOfPvs', 'pvName')
  }

  const storedDataOfWrsPvs = localStorage.getItem('dataOfWrsPvs')
  if (storedDataOfWrsPvs) {
    dataOfWrsPvs.value = JSON.parse(storedDataOfWrsPvs)
  } else {
    dataOfWrs.value.forEach((wr) => {
      wr.wrInUse = false
    })

    dataOfPvs.value.forEach((pv) => {
      pv.pvInUse = false
    })
    // console.log(dataOfPvs.value)
  }
})
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="clearDataInLocalStore"
        >
          <i class="bi bi-database-x"></i>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- WR -->
        <div id="formWr" class="card mb-4 shadow">
          <div class="card-header font-weight-bold">
            <button
              id="showForm"
              type="button"
              class="btn btn-outline-secondary btn-sm float-end"
              @click="showForm = !showForm"
            >
              <i :class="showForm ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
            </button>
            <h5 class="card-title">
              <i class="bi bi-plug"></i> Geräte / Wechselrichter
              {{ dataOfWr.wrId === null ? 'anlegen' : 'ändern' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Hier kannst Du den Wechselrichter mit seinen Daten
              {{ dataOfWr.wrId === null ? 'anlegen' : 'ändern' }}. Du hast bereits
              {{ countOfWrs }} Wechselrichter angelegt.
            </h6>
          </div>

          <Transition>
            <div v-show="showForm" class="card-body">
              <input type="hidden" id="wrId" v-model="dataOfWr.wrId" />
              <input type="checkbox" id="checkbox" v-model="dataOfWr.wrInUse" />
              <div class="row">
                <div class="col-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Bezeichnung</span>
                    <input
                      type="text"
                      class="form-control"
                      id="wrName"
                      placeholder="z.B. Ecoflow Powerstream"
                      v-model="dataOfWr.wrName"
                    />
                  </div>
                </div>

                <div class="col-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Kürzel</span>
                    <input
                      type="text"
                      class="form-control"
                      id="wrNameShort"
                      placeholder="z.B. EF PS 1"
                      v-model="dataOfWr.wrNameShort"
                    />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Anzahl MPPTs</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrMppts"
                      placeholder="z.B. 2"
                      v-model="dataOfWr.wrMppts"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">Stk.</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">PV Eingangsleistung (pro Mppt)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrP"
                      placeholder="z.B. 400"
                      v-model="dataOfWr.wrP"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">W</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">min. Eingangsspannung</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrMinU"
                      placeholder="z.B. 10"
                      v-model="dataOfWr.wrMinU"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">V</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">max. Eingangsspannung</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrMaxU"
                      placeholder="z.B. 55"
                      v-model="dataOfWr.wrMaxU"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">V</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">max. Eingangsstrom</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrI"
                      placeholder="z.B. 10"
                      v-model="dataOfWr.wrI"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">A</span>
                  </div>
                </div>
              </div>
              <button
                v-if="dataOfWr.wrId === null"
                type="button"
                class="btn btn-outline-secondary btn-sm float-end"
                @click="saveWr"
                v-bind:disabled="!btnSave"
              >
                <i class="bi-floppy"></i> SPEICHERN
              </button>

              <button
                v-else
                type="button"
                class="btn btn-outline-secondary btn-sm float-end"
                @click="updateWr"
                v-bind:disabled="!btnSave"
              >
                <i class="bi-pencil"></i> ÄNDERN
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm float-end me-1"
                @click="clearDataOfWr"
              >
                <i class="bi-x-lg"></i> LEEREN
              </button>
            </div>
          </Transition>

          <!-- Ausgabe WR -->
          <div class="card m-3">
            <div class="card-body">
              <h6 class="card-title"><i class="bi bi-plug"></i> Wechselrichter</h6>

              <div class="table-responsive">
                <table class="table text-center w-100">
                  <thead>
                    <tr>
                      <!-- <th scope="col">#</th> -->
                      <th scope="col" class="text-start">
                        Bezeichnung
                        <i
                          class="bi bi-arrow-down-up iClick"
                          @click="sortData('dataOfWrs', 'wrName')"
                        ></i>
                      </th>

                      <th scope="col" class="text-start">Kürzel</th>
                      <th scope="col">min. V</th>
                      <th scope="col">max. V</th>
                      <th scope="col">A</th>
                      <th scope="col">W</th>
                      <th scope="col">MPPTs</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="dataWr in dataOfWrs" :key="dataWr.wrId">
                      <tr>
                        <!-- <td>
                          {{ dataWr.wrId }}
                        </td> -->
                        <td class="text-start">
                          {{ dataWr.wrName }}
                        </td>
                        <td class="text-start">{{ dataWr.wrNameShort }}</td>
                        <td>{{ dataWr.wrMinU }}</td>
                        <td>{{ dataWr.wrMaxU }}</td>
                        <td>{{ dataWr.wrI }}</td>
                        <td>{{ dataWr.wrP }}</td>
                        <td>{{ dataWr.mppts.length }}</td>
                        <td>
                          <button
                            type="button"
                            :class="`btn btn-${dataWr.wrInUse ? 'secondary' : 'danger'}  btn-sm float-end`"
                            @click="delWr(dataWr.wrId)"
                            v-bind:disabled="dataWr.wrInUse"
                          >
                            <i class="bi bi-trash"></i>
                          </button>

                          <button
                            type="button"
                            :class="`btn btn-warning btn-sm float-end ms-2 me-2`"
                            @click="editWr(dataWr)"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>

                          <button class="btn btn-success btn-sm float-end" @click="copyWr(dataWr)">
                            <i class="bi bi-copy"></i>
                          </button>
                        </td>
                      </tr>
                      <!-- <tr>
                        <td colspan="8">{{ dataWr.mppts }}</td>
                      </tr> -->
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- <div class="card m-3" v-for="dataWr in dataOfWrs" :key="dataWr.wrId">
              <div class="card-header">
                <h6 class="card-title float-start pt-1">
                  {{ dataWr.wrName }} ({{ dataWr.wrNameShort }})
                </h6>
                <button
                  :class="`btn ${dataWr.wrInUse ? 'btn-secondary' : 'btn-danger'} btn-sm float-end`"
                  @click="delWr(dataWr.wrId)"
                  v-bind:disabled="dataWr.wrInUse"
                >
                  <i class="bi-trash bi-sm"></i>
                </button>

                <button
                  type="button"
                  class="btn btn-warning btn-sm float-end ms-1 me-1"
                  @click="editWr(dataWr)"
                >
                  <i class="bi-pencil"></i>
                </button>

                <button
                  type="button"
                  class="btn btn-success btn-sm float-end"
                  @click="copyWr(dataWr)"
                >
                  <i class="bi-copy"></i>
                </button>
              </div>
              <div class="card-body">
                <div v-for="(dataWrMppt, index) in dataWr.mppts" :key="index">
                  <div class="card-title">MPPT {{ index + 1 }} (ID: {{ dataWrMppt.mpptId }})</div>
                  <div class="row">
                    <div class="col-md-3">
                      <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text">min. Eing. U (V)</span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="dataWrMppt.mpptMinU"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text">max. Eing. U (V)</span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="dataWrMppt.mpptMaxU"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text">max. Eing. I (A)</span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="dataWrMppt.mpptI"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text">Eing. P (W)</span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="dataWrMppt.mpptP"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <!-- PV -->
        <div id="formPv" class="card mb-4 shadow">
          <div class="card-header">
            <button
              id="showFormPv"
              type="button"
              class="btn btn-outline-secondary btn-sm float-end"
              @click="showFormPv = !showFormPv"
            >
              <i :class="`bi ${showFormPv ? 'bi-dash-lg' : 'bi-plus-lg'}`"></i>
            </button>
            <h5 class="card-title">
              <i class="bi bi-grid"></i> Solarmodule
              {{ dataOfPv.pvId === null ? 'anlegen' : 'ändern' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Hier kannst Du die Solarmodule mit ihren Daten
              {{ dataOfPv.pvId === null ? 'anlegen' : 'ändern' }}. Du hast bereits
              {{ countOfPvs }} Solarpanele angelegt.
            </h6>
          </div>

          <Transition>
            <div v-show="showFormPv" class="card-body">
              <input type="hidden" id="pvId" v-model="dataOfPv.pvId" />
              <div class="row">
                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Bezeichnung</span>
                    <input
                      type="text"
                      class="form-control"
                      id="pvName"
                      placeholder="z.B. Ja Solar 405"
                      v-model="dataOfPv.pvName"
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">max. Leistung (Pmax)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvWp"
                      placeholder="z.B. 405"
                      v-model="dataOfPv.pvWp"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">Watt</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">max. Spannung (Vmp)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvVmp"
                      placeholder="z.B. 31.21"
                      v-model="dataOfPv.pvVmp"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">V</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">max. Strom (Imp)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvVmp"
                      placeholder="z.B. 12.98"
                      v-model="dataOfPv.pvImp"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">A</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Leerlaufspannung (Voc / Uoc)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvVoc"
                      placeholder="z.B. 37.23"
                      v-model="dataOfPv.pvVoc"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">V</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Kurzschlussstrom (ISC / IK)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvIk"
                      placeholder="z.B. 13.87"
                      v-model="dataOfPv.pvIk"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">A</span>
                  </div>
                </div>
                <input type="checkbox" id="checkbox" v-model="dataOfPv.pvInUse" />
              </div>

              <button
                v-if="dataOfPv.pvId === null"
                type="button"
                class="btn btn-outline-secondary btn-sm float-end"
                v-bind:disabled="!btnSavePv"
                @click="savePv"
              >
                <i class="bi-floppy"></i> SPEICHERN
              </button>
              <button
                v-else
                type="button"
                class="btn btn-outline-secondary btn-sm float-end"
                @click="updatePv"
                v-bind:disabled="!btnSavePv"
              >
                <i class="bi-pencil"></i> ÄNDERN
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm float-end me-1"
                @click="clearDataOfPv"
              >
                <i class="bi-x-lg"></i> LEEREN
              </button>
            </div>
          </Transition>

          <!-- Ausgabe PV -->
          <div class="card m-3">
            <div class="card-body">
              <h6 class="card-title"><i class="bi bi-grid"></i> Solarmodule</h6>
              <div class="table-responsive">
                <table class="table text-center">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">
                        Bezeichnung

                        <i
                          class="bi bi-arrow-down-up iClick"
                          @click="sortData('dataOfPvs', 'pvName')"
                        ></i>
                      </th>

                      <th scope="col">max. Wp</th>
                      <th scope="col">max. Vmp</th>
                      <th scope="col">max. Imp</th>
                      <th scope="col">Voc / Uoc</th>
                      <th scope="col">IK / ISC</th>
                      <th scope="col"><i class="bi bi-hdd-network"></i> WR</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dataPv, index) in dataOfPvs" :key="dataPv.pvId">
                      <th scope="row">{{ index + 1 }}</th>
                      <td>{{ dataPv.pvName }}</td>
                      <td>{{ dataPv.pvWp }} Wp</td>
                      <td>{{ dataPv.pvVmp }} V</td>
                      <td>{{ dataPv.pvImp }} A</td>
                      <td>{{ dataPv.pvVoc }} V</td>
                      <td>{{ dataPv.pvIk }} A</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-outline-secondary btn-sm"
                          v-bind:disabled="true"
                          @click="setInUse('pv', dataPv.pvId, !dataPv.pvInUse)"
                        >
                          <i :class="`bi bi-${dataPv.pvInUse ? 'grid-fill' : 'grid'}`"></i>
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-success btn-sm float-start me-1"
                          @click="copyPv(dataPv)"
                        >
                          <i class="bi bi-copy"></i>
                        </button>

                        <button
                          type="button"
                          class="btn btn-warning btn-sm float me-1"
                          @click="getPv(dataPv)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          :class="`btn btn-${dataPv.pvInUse ? 'secondary' : 'danger'} btn-sm float-end`"
                          @click="delPv(dataPv.pvId)"
                          v-bind:disabled="dataPv.pvInUse"
                        >
                          <i class="bi bi-trash bi-sm"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- WR und PV zusammenfügen -->
        <div id="formWrPv" class="card mb-3 shadow">
          <div class="card-header">
            <button
              id="showFormWrPv"
              type="button"
              class="btn btn-outline-secondary btn-sm float-end"
              @click="showFormWrPv = !showFormWrPv"
            >
              <i :class="`bi bi-${showFormWrPv ? 'dash-lg' : 'plus-lg'}`"></i>
            </button>
            <h5 class="card-title">
              <i class="bi bi-lightning"></i> Verbindung Wechselrichter (WR) und Solarmodule (PV)
              {{ dataOfWrPv.id === null ? 'anlegen' : 'ändern' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Hier kannst Du die Verbindung des Wechselrichter mit den Solarmodulen
              {{ dataOfWrPv.id === null ? 'anlegen' : 'ändern' }}.
            </h6>
          </div>

          <Transition>
            <div v-show="showFormWrPv" class="card-body">
              <div class="card m-3">
                <div class="card-body">
                  <div class="row">
                    <div class="col-12"></div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-6">
                      <div class="input-group mb-3">
                        <span class="input-group-text" id="selectWr">WR</span>
                        <select class="form-select form-select-sm" v-model="dataOfWrPv.dataWr">
                          <option v-for="(mppt, index) in allMpptsOfWrs" :key="index" :value="mppt">
                            {{ mppt.wrNameShort }} - MPPT ID: {{ mppt.mpptId }} - [min.
                            {{ mppt.mpptMinU }} V, max. {{ mppt.mpptMaxU }} V, {{ mppt.mpptI }} A,
                            {{ mppt.mpptP }} Wp]
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-12 col-md-4">
                      <div class="input-group mb-3">
                        <span class="input-group-text" id="selectPv">PV</span>
                        <select class="form-select form-select-sm" v-model="dataOfWrPv.dataPv">
                          <option
                            v-for="(pv, index) in dataOfPvs"
                            :key="index"
                            :value="pv"
                            :disabled="pv.pvInUse"
                          >
                            {{ pv.pvName }} [{{ pv.pvVoc }} V, {{ pv.pvIk }} A, {{ pv.pvWp }} Wp]
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-12 col-md-2">
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm float-end"
                        @click="saveWrPv"
                        v-bind:disabled="btnSaveWrPv"
                      >
                        <i class="bi bi-floppy"></i> SPEICHERN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- <div class="card">
            <div class="card-body" v-if="dataOfWrsPvs.length >= 1">
              Verbindungen
              <div class="table-responsive">
                <table class="table text-center">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">WR ID</th>
                      <th scope="col">MPPT ID</th>
                      <th scope="col">PV ID</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in dataOfWrsPvs" :key="item.id">
                      <td>{{ item.id }}</td>
                      <td>{{ item.wrId }}</td>
                      <td>{{ item.mpptId }}</td>
                      <td>{{ item.pvId }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="delWrPv(item.id)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="card-body">Es sind noch keine Verbindungen angelegt.</div>
          </div> -->
        </div>

        <!-- Rechner -->
        <div class="card shadow mb-3">
          <div class="card-header">
            <h5 class="card-title"><i class="bi bi-plug"></i> Zusammenfassung</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Hier siehst Du die Geräte / Wechselrichter, deren MPPTs und die Solarmodule und
              Strings. Gruppen können nicht verbunden werden. Strings werden parallel verbunden.
            </h6>
          </div>
          <div class="card-body" v-if="dataCalculator.length > 0">
            <!-- wr -->
            <div class="row justify-content-center" v-for="wr in dataCalculator" :key="wr.wrId">
              <div class="col-12">
                <div class="card mb-3">
                  <div class="card-header h5">{{ wr.wrName }}</div>
                  <div class="card-body">
                    <!-- mppt -->
                    <div class="row">
                      <div :class="col - 12" v-for="(mppt, index) in wr.mppts" :key="mppt.mpptId">
                        <div class="card mb-3">
                          <div class="card-header h6">
                            MPPT {{ index + 1 }} (ID: {{ mppt.mpptId }}) - max.
                            {{ mppt.mpptMaxU }} V, {{ mppt.mpptI }} A, {{ wr.wrP }} W
                          </div>
                          <div
                            class="card-body pb-0"
                            v-if="mppt.result.possibleStrings.length >= 2"
                          >
                            <div
                              class="alert alert-info d-flex align-items-center mb-0"
                              role="alert"
                            >
                              <i class="bi bi-info-square me-2"></i>
                              <div>
                                Es stehen
                                <strong>{{ mppt.result.possibleStrings.length }} Gruppen</strong>
                                zur Verfügung, da unterschiedliche Module (Voc/Uoc) für den MPPT
                                angelegt wurden. Gruppen können <strong>NICHT</strong> miteinander
                                verbunden werden - nur jeweils <strong>EINE GRUPPE</strong> mit
                                diesem MPPT verbinden.
                              </div>
                            </div>
                          </div>

                          <!-- mögliche Strings an PV Modulen -->
                          <div
                            class="card-body"
                            v-for="(possibleStringsAsGroup, index) in mppt.result.possibleStrings"
                            :key="index"
                          >
                            <div class="row">
                              <div class="col-12">
                                <div class="card">
                                  <div class="card-header">
                                    Gruppe bestehend aus allen Modulen mit gleicher Leerlaufspannung
                                    ({{ possibleStringsAsGroup.voc }} Voc/Uoc)
                                  </div>
                                  <div class="card-body">
                                    <div class="row">
                                      <div class="col-12">
                                        <!-- alert warnung -->
                                        <div
                                          class="alert alert-warning d-flex align-items-center"
                                          role="alert"
                                          v-if="
                                            !possibleStringsAsGroup.isSame &&
                                            possibleStringsAsGroup.primaryString !== null &&
                                            possibleStringsAsGroup.secondaryString !== null
                                          "
                                        >
                                          <i class="bi bi-info-square me-2"></i>
                                          <div>
                                            <strong
                                              >String 1 und 2 können (noch) nicht parallel verbunden
                                              werden</strong
                                            >, da die Anzahl der Module (Summe der Voc/Uoc) je
                                            String nicht identisch sind.
                                            <strong
                                              >Füge ein weiteres Modul hinzu oder entferne ein
                                              Modul.</strong
                                            >
                                          </div>
                                        </div>
                                        <!-- alert success -->
                                        <div
                                          class="alert alert-success d-flex align-items-center"
                                          role="alert"
                                          v-if="
                                            !possibleStringsAsGroup.isSame &&
                                            (possibleStringsAsGroup.primaryString !== null ||
                                              possibleStringsAsGroup.secondaryString !== null)
                                          "
                                        >
                                          <i class="bi bi-check-square me-2"></i>
                                          <div>
                                            <strong
                                              >String 1
                                              {{
                                                possibleStringsAsGroup.secondaryString !== null
                                                  ? 'oder String 2'
                                                  : ''
                                              }}
                                              kann mit dem MPPT verbunden werden.
                                            </strong>

                                            Es kann
                                            {{
                                              mppt.mpptMaxU10 >
                                              parseInt(
                                                possibleStringsAsGroup.primaryString.totalVoc
                                              ) +
                                                parseInt(
                                                  possibleStringsAsGroup.primaryString.totalVoc /
                                                    possibleStringsAsGroup.primaryString
                                                      .numberOfModules
                                                )
                                                ? 'ein'
                                                : 'kein'
                                            }}

                                            weiteres (gleiches) Modul diesem String hinzugefügt
                                            werden.
                                          </div>
                                        </div>
                                        <!-- alert success -->
                                        <div
                                          class="alert alert-success d-flex align-items-center"
                                          role="alert"
                                          v-if="possibleStringsAsGroup.isSame"
                                        >
                                          <i class="bi bi-check-square me-2"></i>
                                          <div>
                                            <strong
                                              >String 1 und 2 können parallel mit Y Kabel Paar
                                              verbunden werden.</strong
                                            >
                                            Beide Strings können
                                            <strong>NICHT in Reihe</strong> verbunden werden.
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div class="row">
                                      <!-- String 1-->
                                      <div
                                        :class="
                                          possibleStringsAsGroup.primaryString !== null &&
                                          possibleStringsAsGroup.secondaryString === null
                                            ? 'col-12'
                                            : 'col-12 col-md-6'
                                        "
                                      >
                                        <div class="card mb-3">
                                          <div class="card-header">
                                            <i class="bi bi-grid me-2"></i>
                                            <strong
                                              >String 1
                                              {{
                                                possibleStringsAsGroup.primaryString
                                                  .numberOfModules > 1
                                                  ? '(Module in Reihe verkabeln)'
                                                  : possibleStringsAsGroup.secondaryString !== null
                                                    ? ''
                                                    : '(Modul direkt anstecken)'
                                              }}</strong
                                            ><br />bestehend aus
                                            {{
                                              possibleStringsAsGroup.primaryString.numberOfModules
                                            }}
                                            Modul(en),
                                            {{ possibleStringsAsGroup.primaryString.totalVoc }}
                                            Voc/Uoc,
                                            {{ possibleStringsAsGroup.primaryString.totalPower }} Wp
                                          </div>
                                          <div class="card-body">
                                            <ul
                                              class="list-group"
                                              v-if="possibleStringsAsGroup.primaryString !== null"
                                            >
                                              <li
                                                class="list-group-item"
                                                v-for="(modul, index) in possibleStringsAsGroup
                                                  .primaryString.modules"
                                                :key="index"
                                              >
                                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc,
                                                {{ modul.pvWp }} Wp
                                                <button
                                                  type="button"
                                                  class="btn btn-danger btn-sm float-end"
                                                  @click="delWrPv(modul.idWrsPvs)"
                                                >
                                                  <i class="bi bi-trash"></i>
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- String 2 -->
                                      <div
                                        :class="
                                          possibleStringsAsGroup.primaryString === null &&
                                          possibleStringsAsGroup.secondaryString !== null
                                            ? 'col-12'
                                            : 'col-12 col-md-6'
                                        "
                                      >
                                        <div
                                          class="card mb-3"
                                          v-if="possibleStringsAsGroup.secondaryString !== null"
                                        >
                                          <div class="card-header">
                                            <i class="bi bi-grid me-2"></i>
                                            <strong
                                              >String 2
                                              {{
                                                possibleStringsAsGroup.secondaryString
                                                  .numberOfModules > 1
                                                  ? '(Module in Reihe verkabeln)'
                                                  : possibleStringsAsGroup.primaryString !== null
                                                    ? ''
                                                    : '(Modul direkt anstecken)'
                                              }}</strong
                                            ><br />bestehend aus
                                            {{
                                              possibleStringsAsGroup.secondaryString.numberOfModules
                                            }}
                                            Module(n),
                                            {{ possibleStringsAsGroup.secondaryString.totalVoc }}
                                            Voc/Uoc,
                                            {{ possibleStringsAsGroup.secondaryString.totalPower }}
                                            Wp
                                          </div>
                                          <div class="card-body">
                                            <ul
                                              class="list-group"
                                              v-if="possibleStringsAsGroup.secondaryString !== null"
                                            >
                                              <li
                                                class="list-group-item"
                                                v-for="(modul, index) in possibleStringsAsGroup
                                                  .secondaryString.modules"
                                                :key="index"
                                              >
                                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc,
                                                {{ modul.pvWp }} Wp
                                                <button
                                                  type="button"
                                                  class="btn btn-danger btn-sm float-end"
                                                  @click="delWrPv(modul.idWrsPvs)"
                                                >
                                                  <i class="bi bi-trash"></i>
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- zu viele Module -->
                          <div class="card-body" v-if="mppt.result.toManyModules.length >= 1">
                            <ul
                              class="list-group mb-3"
                              v-for="(modul, index) in mppt.result.toManyModules"
                              :key="index"
                            >
                              <li class="list-group-item list-group-item-warning">
                                Module die zu viel sind, da nur 2 Strings möglich
                              </li>
                              <li class="list-group-item">
                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc, {{ modul.pvWp }} Wp
                                <button
                                  type="button"
                                  class="btn btn-danger btn-sm float-end"
                                  @click="delWrPv(modul.idWrsPvs)"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </li>
                            </ul>
                          </div>

                          <!-- nicht passende Module -->
                          <div class="card-body" v-if="mppt.result.notPossibleModules.length >= 1">
                            <ul
                              class="list-group mb-3"
                              v-for="(modul, index) in mppt.result.notPossibleModules"
                              :key="index"
                            >
                              <li class="list-group-item list-group-item-danger">
                                Module die nicht verwendet werden können
                              </li>
                              <li class="list-group-item">
                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc, {{ modul.pvWp }} Wp
                                <button
                                  type="button"
                                  class="btn btn-danger btn-sm float-end"
                                  @click="delWrPv(modul.idWrsPvs)"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body" v-else>
            Es sind keine Wechselrichter und dessen MPPTs mit Modulen verbunden.
          </div>
        </div>
      </div>
    </div>
    <div id="footer"></div>
    <!-- DATA WR<br />
    <pre>{{ dataOfWrs }}</pre>
    <hr /> -->
    <!--
    DATA PV<br />
    <pre>{{ dataOfPvs }}</pre>
    <hr />
    Data WR + PV<br />
    <pre>{{ dataOfWrsPvs }}</pre>
    <hr /> -->
    <!-- Data Calc
    <pre>{{ dataCalculator }}</pre> -->
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.abtn:hover,
.iClick:hover {
  cursor: pointer;
}

.progress,
.progress-bar,
.progress-stacked {
  height: 30px;
}
.bg-success-300 {
  background-color: #75b798;
}
/* 
.list-group-item.active {
    z-index: 2;
    color: var(--bs-list-group-active-color);
    background-color: var(--bs-list-group-active-bg);
    border-color: var(--bs-list-group-active-border-color);
} */
</style>
