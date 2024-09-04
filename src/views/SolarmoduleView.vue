<script setup>
import { computed, ref, onMounted } from 'vue'
import { loadDataLocalStore, saveDataLocalStore } from '@/composables/useLocalStorage.js'
import { sortData } from '@/composables/useSortData.js'
import LinkSort from '@/components/LinkSort.vue'
import DefaultDataPvs from '@/components/DefaultDataPvs.vue'
import BsModal from '@/components/BsModal.vue'

const dataOfPv = ref({
  pvId: null,
  pvName: '',
  pvWp: null,
  pvVmp: null,
  pvImp: null,
  pvVoc: null,
  pvIk: null,
  pvInUse: false
})

const dataOfPvs = ref([])

const showFormPv = ref(false)
const defaultKey = ref('pvName')
const defaultSort = ref('up')

const btnSavePv = computed(() => {
  return (
    dataOfPv.value.pvName !== '' &&
    dataOfPv.value.pvWp !== null &&
    dataOfPv.value.pvVmp !== null &&
    dataOfPv.value.pvImp !== null &&
    dataOfPv.value.pvVoc !== null &&
    dataOfPv.value.pvIk !== null
  )
})

const countOfPvs = computed(() => {
  return dataOfPvs.value.length
})

function savePv() {
  const objDataPv = {
    ...dataOfPv.value,
    pvId: new Date().getTime()
  }
  dataOfPvs.value.push(objDataPv)

  saveDataLocalStore('dataOfPvs', dataOfPvs.value)
  sortDataByKey('pvName', defaultSort.value)
}

function updatePv() {
  const dataUpdateIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === dataOfPv.value.pvId)
  const objDataPv = {
    ...dataOfPv.value
  }

  dataOfPvs.value[dataUpdateIndex] = objDataPv
  saveDataLocalStore('dataOfPvs', dataOfPvs.value)
  sortDataByKey('pvName', defaultSort.value)
  clearDataOfPv()
  showFormPv.value = false
}

function editPv(editDataPv) {
  console.log('edit pv data', editDataPv)
  dataOfPv.value = {
    ...editDataPv
  }
  showFormPv.value = true
}

function copyPv(copyDataPv) {
  const newPvId = new Date().getTime()
  const objDataPv = {
    ...copyDataPv,
    pvId: newPvId,
    pvInUse: false
  }
  dataOfPvs.value.push(objDataPv)

  saveDataLocalStore('dataOfPvs', dataOfPvs.value)
  sortDataByKey('pvName', defaultSort.value)
}

function delPv(pvId) {
  if (pvId) {
    const dataDeleteIndex = dataOfPvs.value.findIndex((obj) => obj.pvId === pvId)
    dataOfPvs.value.splice(dataDeleteIndex, 1)
    saveDataLocalStore('dataOfPvs', dataOfPvs.value)
  }
  dataModal.value = { key: '', id: null }
}

function clearDataOfPv() {
  dataOfPv.value = {
    pvId: null,
    pvName: '',
    pvWp: null,
    pvVmp: null,
    pvImp: null,
    pvVoc: null,
    pvIk: null,
    pvInUse: false
  }
}

// Funktion, die den Wert vom Event auffängt und speichert
function setDataOfPv(value) {
  dataOfPv.value = {
    ...value
  }
}

// emit from component LinkSort
function sortDataByKey(key, sort) {
  dataOfPvs.value = sortData(key, dataOfPvs.value, sort)
  defaultSort.value = sort
  defaultKey.value = key
}

const dataModal = ref({ key: '', id: null })
function showModal(key, id) {
  dataModal.value = { key, id }
}

onMounted(() => {
  const storedDataOfPvs = loadDataLocalStore('dataOfPvs')
  if (storedDataOfPvs) {
    dataOfPvs.value = storedDataOfPvs
    sortDataByKey(defaultKey.value, defaultSort.value)
  }
})
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div id="formPv" class="card mt-4 mb-4 shadow">
        <div class="card-header">
          <button
            id="showFormPv"
            type="button"
            class="btn btn-secondary btn-sm float-end"
            @click="showFormPv = !showFormPv"
          >
            <i :class="`bi ${showFormPv ? 'bi-dash-lg' : 'bi-plus-lg'}`"></i>
          </button>
          <h4 class="card-title">
            <i class="bi bi-grid"></i> Solarmodule
            {{ dataOfPv.pvId === null ? 'anlegen' : 'ändern' }}
          </h4>
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
                <DefaultDataPvs @update:changePv="setDataOfPv" />
              </div>
            </div>
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

              <div class="col-12 col-lg-4">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">max. Leistung (Pmax)</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pvWp"
                    placeholder="z.B. 405"
                    v-model="dataOfPv.pvWp"
                    min="0"
                  />
                  <span class="input-group-text">Watt</span>
                </div>
              </div>

              <div class="col-12 col-lg-4">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">max. Spannung (Vmp)</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pvVmp"
                    placeholder="z.B. 31.21"
                    v-model="dataOfPv.pvVmp"
                    min="0"
                  />
                  <span class="input-group-text">V</span>
                </div>
              </div>

              <div class="col-12 col-lg-4">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">max. Strom (Imp)</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pvVmp"
                    placeholder="z.B. 12.98"
                    v-model="dataOfPv.pvImp"
                    min="0"
                  />
                  <span class="input-group-text">A</span>
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">Leerlaufspannung (Voc / Uoc)</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pvVoc"
                    placeholder="z.B. 37.23"
                    v-model="dataOfPv.pvVoc"
                    min="0"
                  />
                  <span class="input-group-text">V</span>
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">Kurzschlussstrom (ISC / IK)</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pvIk"
                    placeholder="z.B. 13.87"
                    v-model="dataOfPv.pvIk"
                    min="0"
                  />
                  <span class="input-group-text">A</span>
                </div>
              </div>
              <input type="checkbox" id="checkbox" v-model="dataOfPv.pvInUse" class="d-none" />
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
          <div class="card-header h5"><i class="bi bi-grid"></i> Solarmodule</div>
          <div class="card-body" v-if="dataOfPvs.length >= 1">
            <div class="table-responsive">
              <table class="table text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      Bezeichnung

                      <LinkSort
                        @click:SortData="sortDataByKey"
                        :sortKey="'pvName'"
                        :sortIcon="'alpha'"
                        :sortActive="defaultKey"
                      />
                    </th>

                    <th>
                      max. Wp
                      <LinkSort
                        @click:SortData="sortDataByKey"
                        :sortKey="'pvWp'"
                        :sortIcon="'numeric'"
                        :sortActive="defaultKey"
                      />
                    </th>
                    <th>max. Vmp</th>
                    <th>max. Imp</th>
                    <th>
                      Voc / Uoc
                      <LinkSort
                        @click:SortData="sortDataByKey"
                        :sortKey="'pvVoc'"
                        :sortIcon="'numeric'"
                        :sortActive="defaultKey"
                      />
                    </th>
                    <th>IK / ISC</th>
                    <th><i class="bi bi-plug"></i> WR</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dataPv, index) in dataOfPvs" :key="dataPv.pvId">
                    <td>{{ index + 1 }}</td>
                    <td>{{ dataPv.pvName }}</td>
                    <td>{{ dataPv.pvWp }} Wp</td>
                    <td>{{ dataPv.pvVmp }} V</td>
                    <td>{{ dataPv.pvImp }} A</td>
                    <td>{{ dataPv.pvVoc }} V</td>
                    <td>{{ dataPv.pvIk }} A</td>
                    <td>
                      <!-- <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        v-bind:disabled="true"
                      >
                        <i :class="`bi bi-${dataPv.pvInUse ? 'ui-checks-grid' : 'grid'}`"></i>
                      </button> -->
                      <i :class="`bi bi-${dataPv.pvInUse ? 'ui-checks-grid' : 'grid'} `"></i>
                    </td>
                    <td>
                      <div class="d-inline-block">
                        <button
                          type="button"
                          class="btn btn-success btn-sm float-start me-1"
                          @click="copyPv(dataPv)"
                        >
                          <i class="bi bi-copy"></i>
                        </button>

                        <button
                          type="button"
                          :class="`btn btn-${dataPv.pvInUse ? 'secondary' : 'warning'} btn-sm float me-1`"
                          @click="editPv(dataPv)"
                          :disabled="dataPv.pvInUse"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          :class="`btn btn-${dataPv.pvInUse ? 'secondary' : 'danger'} btn-sm float-end`"
                          @click="showModal('pv', dataPv.pvId)"
                          :disabled="dataPv.pvInUse"
                        >
                          <i class="bi bi-trash bi-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-body" v-else>Es sind aktuell keine Solarmodule angelegt.</div>
        </div>
      </div>
    </div>
    <BsModal :data="dataModal" @click:delItem="delPv" />
  </div>
</template>

<style scoped>
@media (max-width: 991px) {
  table tr td:last-child button {
    display: flex;
    margin: 0 0 0.25rem 0 !important;
    float: none !important;
  }
}
@media (min-width: 992px) {
  table tr td:last-child {
    width: 150px;
  }
}

table tr:nth-child(odd) td {
  background-color: #f0f0f0;
}
</style>
