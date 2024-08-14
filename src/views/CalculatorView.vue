<script setup>
import { computed, ref, onMounted } from 'vue'

const dataOfWr = ref({
  wrId: null,
  wrName: '',
  wrNameShort: '',
  wrU: null,
  wrI: null,
  wrP: null,
  wrMppts: null,
  mppts: []
})

const dataOfPv = ref({
  pvId: null,
  pvName: '',
  pvVoc: null,
  pvIk: null,
  pvWp: null,
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
    dataOfWr.value.wrU > 0 &&
    dataOfWr.value.wrI > 0 &&
    dataOfWr.value.wrP > 0 &&
    dataOfWr.value.wrMppts > 0
  )
})

const btnSavePv = computed(() => {
  return (
    dataOfPv.value.pvName !== '' &&
    dataOfPv.value.pvVoc > 0 &&
    dataOfPv.value.pvIk > 0 &&
    dataOfPv.value.pvWp > 0
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

// all mppts
const allMpptsOfWrs = computed(() =>
  dataOfWrs.value.flatMap((wr) => {
    return wr.mppts.map((mppt) => {
      return { wrId: wr.wrId, wrName: wr.wrName, wrNameShort: wr.wrNameShort, ...mppt }
    })
  })
)

// all pvs

function saveWr() {
  console.log('save wr', dataOfWr.value)
  const setWrId = new Date().getTime()
  const objDataWr = {
    ...dataOfWr.value,
    wrId: setWrId,
    mppts: Array.from({ length: dataOfWr.value.wrMppts }, () => ({
      mpptId: parseFloat(`${setWrId}${Math.floor(Math.random() * 100)}`),
      mpptU: dataOfWr.value.wrU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP
    }))
  }
  dataOfWrs.value.push(objDataWr)

  saveDataInLocalStore('dataOfWrs', dataOfWrs.value)

  clearDataOfWr()
  showForm.value = false
}

function updateWr() {
  console.log('update wr', dataOfWr.value)
  console.log('wrMppts', dataOfWr.value.wrMppts)
  console.log('mppts', dataOfWr.value.mppts.length)

  const valMppts = dataOfWr.value.wrMppts
  const arrMppts = dataOfWr.value.mppts.length

  let oldMppts = dataOfWr.value.mppts.map((mppt) => {
    return {
      mpptId: mppt.mpptId,
      mpptU: dataOfWr.value.wrU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP
    }
  })

  let newMppts = []

  let setMppts = null

  if (valMppts > arrMppts) {
    newMppts = Array.from({ length: valMppts - arrMppts }, () => ({
      mpptId: parseFloat(`${dataOfWr.value.wrId}${Math.floor(Math.random() * 100)}`),
      mpptU: dataOfWr.value.wrU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP
    }))

    setMppts = oldMppts.concat(newMppts)
  } else if (valMppts < arrMppts) {
    // console.log('old slice before', oldMppts)
    setMppts = oldMppts.slice(0, valMppts)
    // console.log('old slice after', setMppts)
    // console.log('letzten weg')
  } else {
    setMppts = oldMppts
  }

  // console.log('new Mppts', newMppts)
  // console.log('old Mppts', oldMppts)
  // console.log('set Mppts', setMppts)

  const dataUpdateIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === dataOfWr.value.wrId)
  const objDataWr = {
    ...dataOfWr.value,
    mppts: setMppts
  }

  // console.log(objDataWr)

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
  const index = dataOfWrsPvs.value.findIndex((obj) => obj.wrId === delWrId)
  console.log(index)
  // const dataDeleteIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === delWrId)
  // dataOfWrs.value.splice(dataDeleteIndex, 1)

  // saveDataInLocalStore('dataOfWrs', dataOfWrs.value)
}

function clearDataOfWr() {
  console.log('clear wr form')
  dataOfWr.value.wrId = null
  dataOfWr.value.wrName = ''
  dataOfWr.value.wrNameShort = ''
  dataOfWr.value.wrU = ''
  dataOfWr.value.wrI = ''
  dataOfWr.value.wrP = ''
  dataOfWr.value.wrMppts = ''
}

function clearDataOfPv() {
  console.log('clear pv form')
  dataOfPv.value.pvId = null
  dataOfPv.value.pvName = ''
  dataOfPv.value.pvVoc = null
  dataOfPv.value.pvIk = null
  dataOfPv.value.pvWp = null
  // dataOfPv.value.pvMpptId = null
}

function clearDataOfWrPv() {
  console.log('clear wr pv form')
  dataOfWrPv.value.id = null
  dataOfWrPv.value.dataWr = {}
  dataOfWrPv.value.dataPv = {}
}

function savePv() {
  console.log('save pv', dataOfPv.value)
  const objDataPv = {
    ...dataOfPv.value,
    pvId: new Date().getTime()
  }
  dataOfPvs.value.push(objDataPv)

  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)
}

function editPv(editDataPv) {
  console.log('edit pv data', editDataPv)
  dataOfPv.value = {
    ...editDataPv
  }

  // saveDataInLocalStore('dataOfWrs', dataOfWrs.value)
  showFormPv.value = true
}

function updatePv(pvId) {
  console.log('update pv', dataOfPv.value)

  let dataUpdateIndex
  let objDataPv

  if (pvId !== null) {
    console.log('nur in Use')
    dataUpdateIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === pvId)

    objDataPv = {
      ...dataOfPvs.value[dataUpdateIndex],
      pvInUse: true
    }
  } else {
    dataUpdateIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === dataOfPv.value.pvId)
    objDataPv = {
      ...dataOfPv.value
    }
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

function delPv(delPvId) {
  console.log('delete pv id', delPvId)

  const dataDeleteIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === delPvId)
  dataOfPvs.value.splice(dataDeleteIndex, 1)
  saveDataInLocalStore('dataOfPvs', dataOfPvs.value)

  const dataDeleteWrsPvsIndex = dataOfWrsPvs.value.findIndex((obj) => obj.pvId === delPvId)
  dataOfWrsPvs.value.splice(dataDeleteWrsPvsIndex, 1)
  saveDataInLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
  //
}

// MPPT + PV
function saveWrPv() {
  console.log('save wr+pv', dataOfWrPv)
  const objDataWrPv = {
    // ...dataOfWrPv.value,
    id: new Date().getTime(),
    wrId: dataOfWrPv.value.dataWr.wrId,
    mpptId: dataOfWrPv.value.dataWr.mpptId,
    pvId: dataOfWrPv.value.dataPv.pvId
  }

  // console.log(objDataWrPv)
  dataOfWrsPvs.value.push(objDataWrPv)

  updatePv(dataOfWrPv.value.dataPv.pvId)

  clearDataOfWrPv()

  saveDataInLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
}

function saveDataInLocalStore(key, data) {
  console.log('saveDataInLocalStore')
  localStorage.setItem(key, JSON.stringify(data))
}

function clearDataInLocalStore() {
  localStorage.clear()
  dataOfWrs.value = []
  dataOfPvs.value = []
  dataOfWrsPvs.value = []
}

onMounted(() => {
  const storedDataOfWrs = localStorage.getItem('dataOfWrs')
  if (storedDataOfWrs) {
    dataOfWrs.value = JSON.parse(storedDataOfWrs)
  }

  const storedDataOfPv = localStorage.getItem('dataOfPvs')
  if (storedDataOfPv) {
    dataOfPvs.value = JSON.parse(storedDataOfPv)
  }

  const storedDataOfWrsPvs = localStorage.getItem('dataOfWrsPvs')
  if (storedDataOfWrsPvs) {
    dataOfWrsPvs.value = JSON.parse(storedDataOfWrsPvs)
  }
})
</script>
<template>
  <div class="container">
    {{ dataOfWrs }}
    <hr />
    {{ dataOfPvs }}
    <hr />
    <div class="row">
      <div class="col-12">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="clearDataInLocalStore"
        >
          <i class="bi-database-x"></i>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- WR -->
        <div id="formWr" class="card mb-3 shadow">
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
              <i class="bi-plug"></i> Wechselrichter
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
                    <span class="input-group-text">max. Eingangsspannung</span>
                    <input
                      type="number"
                      class="form-control"
                      id="wrU"
                      placeholder="z.B. 55"
                      v-model="dataOfWr.wrU"
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
              <h6 class="card-title"><i class="bi-plug"></i> Wechselrichter</h6>
            </div>
            <div class="card m-3" v-for="dataWr in dataOfWrs" :key="dataWr.wrId">
              <div class="card-header">
                <h6 class="card-title float-start pt-1">
                  {{ dataWr.wrName }} ({{ dataWr.wrNameShort }})
                </h6>
                <a
                  title="Eintrag löschen"
                  type="button"
                  class="btn btn-outline-danger btn-sm float-end ms-1"
                  @click="delWr(dataWr.wrId)"
                >
                  <i class="bi-trash bi-sm"></i>
                </a>
                <a
                  href="#footer"
                  title="Eintrag duplizieren"
                  type="button"
                  class="btn btn-outline-secondary btn-sm float-end ms-1"
                  @click="copyWr(dataWr)"
                >
                  <i class="bi-copy"></i>
                </a>
                <a
                  href="#formWr"
                  title="Eintrag ändern"
                  type="button"
                  class="btn btn-outline-secondary btn-sm float-end"
                  @click="editWr(dataWr)"
                >
                  <i class="bi-pencil"></i>
                </a>
              </div>
              <div class="card-body">
                <div v-for="(dataWrMppt, index) in dataWr.mppts" :key="index">
                  <div class="card-title">MPPT {{ index + 1 }} (ID: {{ dataWrMppt.mpptId }})</div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text">max. Eing. U (V)</span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="dataWrMppt.mpptU"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
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
                    <div class="col-md-4">
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
                  <!-- Solar {{ getPv() }} -->
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PV -->
        <div id="formPv" class="card mb-3 shadow">
          <div class="card-header font-weight-bold">
            <button
              id="showFormPv"
              type="button"
              class="btn btn-outline-secondary btn-sm float-end"
              @click="showFormPv = !showFormPv"
            >
              <i :class="showFormPv ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
            </button>
            <h5 class="card-title">
              <i class="bi-grid-3x2"></i> Solarmodule
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
                <div class="col-12 col-md-6 col-xl-12">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Bezeichnung</span>
                    <input
                      type="text"
                      class="form-control"
                      id="pvName"
                      placeholder="z.B. Ja Solar 415"
                      v-model="dataOfPv.pvName"
                    />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Leistung</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvWp"
                      placeholder="z.B. 415"
                      v-model="dataOfPv.pvWp"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">Wp</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Leerlaufspannung (Voc / Uoc)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvVoc"
                      placeholder="z.B. 37.1"
                      v-model="dataOfPv.pvVoc"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">V</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Kurzschlussstrom (IK / ISC)</span>
                    <input
                      type="number"
                      class="form-control"
                      id="pvIk"
                      placeholder="z.B. 13.1"
                      v-model="dataOfPv.pvIk"
                      min="1"
                    />
                    <span class="input-group-text" style="width: 40px">A</span>
                  </div>
                </div>

                <!-- <div class="col-12 col-md-6">
                  <div class="input-group input-group-sm mb-3">
                    <label class="input-group-text" for="wrMpptId">MPPT</label>
                    <select class="form-select" id="wrMpptId">
                      <option
                        v-for="(mppt, index) in allMpptsOfWrs"
                        :key="index"
                        :value="mppt.mpptId"
                      >
                        {{ mppt.wrName }} ({{ mppt.mpptU }} V, {{ mppt.mpptI }} A,
                        {{ mppt.mpptP }} Watt)
                      </option>
                    </select>
                  </div>
                </div> -->
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
                @click="updatePv(null)"
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
              <h6 class="card-title"><i class="bi-grid-3x2"></i> Solarmodule</h6>
              <table class="table text-center">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Bezeichnung</th>
                    <th scope="col">Voc / Uoc</th>
                    <th scope="col">IK / ISC</th>
                    <th scope="col">Leistung</th>
                    <th scope="col"><i class="bi bi-hdd-network"></i> WR</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dataPv, index) in dataOfPvs" :key="dataPv.pvId">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ dataPv.pvName }}</td>
                    <td>{{ dataPv.pvVoc }} V</td>
                    <td>{{ dataPv.pvIk }} A</td>
                    <td>{{ dataPv.pvWp }} Wp</td>
                    <td><i :class="`bi bi-${dataPv.pvInUse ? 'check-lg' : 'x-lg'}`"></i></td>
                    <td>
                      <a
                        href="#formPv"
                        title="Eintrag löschen"
                        type="button"
                        class="btn btn-outline-danger btn-sm float-end ms-1"
                        @click="delPv(dataPv.pvId)"
                      >
                        <i class="bi-trash bi-sm"></i>
                      </a>
                      <a
                        href="#footer"
                        title="Eintrag duplizieren"
                        type="button"
                        class="btn btn-outline-secondary btn-sm float-end ms-1"
                        @click="copyPv(dataPv)"
                      >
                        <i class="bi-copy"></i>
                      </a>
                      <a
                        href="#formPv"
                        title="Eintrag ändern"
                        type="button"
                        class="btn btn-outline-secondary btn-sm float-end"
                        @click="editPv(dataPv)"
                      >
                        <i class="bi-pencil"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- WR und PV zusammenfügen -->
        <div id="formWrPv" class="card mb-3 shadow">
          <div class="card-header font-weight-bold">
            <button
              id="showFormWrPv"
              type="button"
              class="btn btn-outline-secondary btn-sm float-end"
              @click="showFormWrPv = !showFormWrPv"
            >
              <i :class="showFormWrPv ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
            </button>
            <h5 class="card-title">
              <i class="bi-lightning"></i> Verbindung Solarmodule und Wechselrichter
              {{ dataOfWrPv.id === null ? 'anlegen' : 'ändern' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Hier kannst Du die Verbindung der Solarmodule mit dem Wechselrichter
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
                    <div class="col-12">
                      WR
                      <select class="form-select form-select-sm" v-model="dataOfWrPv.dataWr">
                        <option v-for="(mppt, index) in allMpptsOfWrs" :key="index" :value="mppt">
                          {{ mppt.wrNameShort }} - MPPT [{{ mppt.mpptU }} V, {{ mppt.mpptI }} A,
                          {{ mppt.mpptP }} Wp]
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      PV
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
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm float-end"
                  @click="saveWrPv"
                >
                  <i class="bi-floppy"></i> SPEICHERN
                </button>
              </div>
            </div>
          </Transition>
          <p>Eingabe</p>
          {{ dataOfWrPv }}
          <p>
            WRs+PVs<br />
            {{ dataOfWrsPvs }}
          </p>
          <!-- -->

          <!-- -->
          <p>
            WR MPPTs<br />
            {{ allMpptsOfWrs }}
          </p>

          <p>
            PVs<br />
            {{ dataOfPvs }}
          </p>
        </div>
      </div>
    </div>
    <div id="footer"></div>
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
</style>
