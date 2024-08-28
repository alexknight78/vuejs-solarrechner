<script setup>
import LinkSort from '@/components/LinkSort.vue'
import DefaultDataWrs from '@/components/DefaultDataWrs.vue'
import { loadDataLocalStore, saveDataLocalStore } from '@/composables/useLocalStorage.js'
import { sortData } from '@/composables/useSortData.js'
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

const dataOfWrs = ref([])

const btnSave = computed(() => {
  return (
    dataOfWr.value.wrName !== '' &&
    dataOfWr.value.wrNameShort !== '' &&
    dataOfWr.value.wrMinU !== null &&
    dataOfWr.value.wrMaxU !== null &&
    dataOfWr.value.wrI !== null &&
    dataOfWr.value.wrP !== null &&
    dataOfWr.value.wrMppts !== null
  )
})

const showForm = ref(false)
const defaultSort = ref(true)

const countOfWrs = computed(() => {
  return dataOfWrs.value.length
})

function saveWr() {
  const setWrId = new Date().getTime()
  const objDataWr = {
    ...dataOfWr.value,
    wrId: setWrId,
    mppts: Array.from({ length: dataOfWr.value.wrMppts }, () => ({
      mpptId: parseFloat(`${setWrId}${Math.floor(Math.random() * 100)}`),
      mpptMinU: dataOfWr.value.wrMinU,
      mpptMaxU: dataOfWr.value.wrMaxU,
      mpptI: dataOfWr.value.wrI,
      mpptP: dataOfWr.value.wrP,
      pvs: []
    }))
  }
  dataOfWrs.value.push(objDataWr)

  saveDataLocalStore('dataOfWrs', dataOfWrs.value)
  sortDataByKey('wrName', defaultSort)
  clearDataOfWr()
  showForm.value = false
}

function updateWr() {
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

  saveDataLocalStore('dataOfWrs', dataOfWrs.value)
  sortDataByKey('wrName', defaultSort)
  clearDataOfWr()
  showForm.value = false
}

function editWr(editDataWr) {
  dataOfWr.value = {
    ...editDataWr
  }

  showForm.value = true
}

function copyWr(copyDataWr) {
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

  saveDataLocalStore('dataOfWrs', dataOfWrs.value)
  sortDataByKey('wrName', defaultSort)
}

function delWr(delWrId) {
  const dataDeleteIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === delWrId)
  dataOfWrs.value.splice(dataDeleteIndex, 1)
  saveDataLocalStore('dataOfWrs', dataOfWrs.value)
}

function clearDataOfWr() {
  dataOfWr.value = {
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
  }
}

// Funktion, die den Wert vom Event auffängt und speichert
function setDataOfWr(value) {
  dataOfWr.value = {
    ...value,
    wrId: null,
    wrInUse: false,
    mppts: []
  }
}

// emit from component LinkSort
function sortDataByKey(key, sort) {
  // sortUpDown.value = !sortUpDown.value
  dataOfWrs.value = sortData(key, dataOfWrs.value, sort)
  defaultSort.value = sort
}

onMounted(() => {
  const storedDataOfWrs = loadDataLocalStore('dataOfWrs')
  if (storedDataOfWrs) {
    dataOfWrs.value = storedDataOfWrs
    sortDataByKey('wrName', defaultSort)
  }
})
</script>

<template>
  <div class="container">
    <!-- <div class="row">
      <div class="col-12">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="clearDataInLocalStore"
        >
          <i class="bi bi-database-x"></i>
        </button>
      </div>
    </div> -->

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
              <input type="checkbox" id="checkbox" v-model="dataOfWr.wrInUse" class="d-none" />
              <div class="row">
                <div class="col-12">
                  <DefaultDataWrs @update:changeWr="setDataOfWr" />
                </div>
              </div>

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
                      min="0"
                    />
                    <span class="input-group-text">Stk.</span>
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
                      min="0"
                    />
                    <span class="input-group-text">W</span>
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
                      min="0"
                    />
                    <span class="input-group-text">V</span>
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
                      min="0"
                    />
                    <span class="input-group-text">V</span>
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
                      min="0"
                    />
                    <span class="input-group-text">A</span>
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
            <div class="card-header"><i class="bi bi-plug"></i> Wechselrichter</div>
            <div class="v-card-body" v-if="dataOfWrs.length >= 1">
              <div class="table-responsive">
                <table class="table text-center w-100">
                  <thead>
                    <tr>
                      <!-- <th scope="col">#</th> -->
                      <th scope="col" class="text-start">
                        Bezeichnung
                        <LinkSort
                          @click:SortData="sortDataByKey"
                          :sortKey="'wrName'"
                          :sortIcon="'alpha'"
                        />
                      </th>

                      <th scope="col" class="text-start">
                        Kürzel
                        <LinkSort
                          @click:SortData="sortDataByKey"
                          :sortKey="'wrNameShort'"
                          :sortIcon="'alpha'"
                        />
                      </th>
                      <th scope="col">min. V</th>
                      <th scope="col">
                        max. V
                        <LinkSort
                          @click:SortData="sortDataByKey"
                          :sortKey="'wrMaxU'"
                          :sortIcon="'numeric'"
                        />
                      </th>
                      <th scope="col">
                        A
                        <LinkSort
                          @click:SortData="sortDataByKey"
                          :sortKey="'wrI'"
                          :sortIcon="'numeric'"
                        />
                      </th>
                      <th scope="col">
                        W
                        <LinkSort
                          @click:SortData="sortDataByKey"
                          :sortKey="'wrP'"
                          :sortIcon="'numeric'"
                        />
                      </th>
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
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-body" v-else>
              Es sind aktuell keine Geräte / Wechselrichter angelegt.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
