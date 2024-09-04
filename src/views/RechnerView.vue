<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  clearDataLocalStore,
  loadDataLocalStore,
  saveDataLocalStore
} from '@/composables/useLocalStorage.js'

import BsModal from '@/components/BsModal.vue'

const dataOfWrPv = ref({
  id: null,
  dataWr: {},
  dataPv: {}
})

const dataOfWrs = ref([])
const dataOfPvs = ref([])
const dataOfWrsPvs = ref([])

const btnSaveWrPv = computed(() => {
  console.log(dataOfWrPv.value.dataPv)
  return (
    Object.keys(dataOfWrPv.value.dataWr).length === 0 ||
    Object.keys(dataOfWrPv.value.dataPv).length === 0
  )
})

const showFormWrPv = ref(false)

const allMpptsOfWrs = computed(() => {
  // Zähle die Anzahl der Vorkommen jeder mpptId
  const mpptCounts = dataOfWrsPvs.value.reduce((acc, item) => {
    if (acc[item.mpptId]) {
      acc[item.mpptId]++
    } else {
      acc[item.mpptId] = 1
    }
    return acc
  }, {})

  // Erzeuge das Array mit den mppts und füge mpptPvCount hinzu
  return dataOfWrs.value.flatMap((wr) => {
    return wr.mppts.map((mppt, index) => {
      return {
        wrId: wr.wrId,
        wrName: wr.wrName,
        wrNameShort: wr.wrNameShort,
        ...mppt,
        mpptIndex: index + 1,
        mpptPvCount: mpptCounts[mppt.mpptId] || 0 // Anzahl der Vorkommen oder 0, wenn nicht vorhanden
        // pvCount: mppt.pv.length
      }
    })
  })
})

function saveWrPv() {
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
  saveDataLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
}

function delWrPv(id) {
  // console.log('delWrPv', id)
  if (id) {
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

    // PV-Status auf false setzen, wenn die PvId gefunden wird
    if (deletedItem) {
      setInUse('pv', deletedItem.pvId, false)
    }

    if (dataOfWrsPvs.value.length > 0) {
      saveDataLocalStore('dataOfWrsPvs', dataOfWrsPvs.value)
    } else {
      clearDataLocalStore('dataOfWrsPvs')
    }
  }

  dataModal.value = { key: '', id: null }
}

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
        totalVmp: (primaryModules[0].pvVmp * primaryModulesCount).toFixed(2),
        totalImp: primaryModules[0].pvImp,
        totalPower: primaryModules[0].pvWp * primaryModulesCount,
        modules: primaryModules,
        modulesCount: primaryModulesCount
      }
    }

    let secondaryString = null
    if (remainingModules.length > 0) {
      const secondaryModulesCount = Math.min(maxModulesInString, remainingModules.length)
      const secondaryModules = remainingModules.slice(0, secondaryModulesCount)

      secondaryString = {
        numberOfModules: secondaryModulesCount,
        totalVoc: (moduleVoc * secondaryModulesCount).toFixed(2),
        totalVmp: (secondaryModules[0].pvVmp * secondaryModulesCount).toFixed(2),
        totalImp: secondaryModules[0].pvImp,
        totalPower: secondaryModules[0].pvWp * secondaryModulesCount,
        modules: secondaryModules,
        modulesCount: secondaryModulesCount
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
      const powerPv =
        (primaryString ? parseInt(primaryString.totalPower) : 0) +
        (secondaryString ? parseInt(secondaryString.totalPower) : 0)
      const powerMppt = parseInt(mppt.mpptP)

      const ifPvHigherElseMppt = powerPv >= powerMppt

      const powerPercent = ifPvHigherElseMppt
        ? (100 - (100 * powerMppt) / powerPv).toFixed(0)
        : ((100 * powerPv) / powerMppt).toFixed(0)
      // powerPv <= powerMppt
      //   ? ((100 * powerPv) / powerMppt).toFixed(0)
      //   : ((100 * powerMppt) / powerPv).toFixed(0)

      possibleStrings.push({
        voc: moduleVoc,
        ifPvHigherElseMppt: ifPvHigherElseMppt,
        powerPv,
        powerMppt,
        powerPercent,
        primaryString: primaryString,
        secondaryString: secondaryString,
        isSame: isSame
      })
    }
  }

  return { possibleStrings, notPossibleModules, toManyModules }
}

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
      saveDataLocalStore('dataOfPvs', dataOfPvs.value)
      break
    case 'wr':
      dataUpdateIndex = dataOfWrs.value.findIndex((obj) => obj.wrId === id)

      objData = {
        ...dataOfWrs.value[dataUpdateIndex],
        wrInUse: status
      }
      dataOfWrs.value[dataUpdateIndex] = objData
      saveDataLocalStore('dataOfWrs', dataOfWrs.value)
      break
  }
  return {
    ...key,
    ...id
  }
}

function clearDataOfWrPv() {
  dataOfWrPv.value.id = null
  dataOfWrPv.value.dataWr = {}
  dataOfWrPv.value.dataPv = {}
}

// Modal
const dataModal = ref({ key: '', id: null })
function showModal(key, id) {
  dataModal.value = { key, id }
}

onMounted(() => {
  const storedDataOfWrs = loadDataLocalStore('dataOfWrs')
  if (storedDataOfWrs) {
    dataOfWrs.value = storedDataOfWrs
  }

  const storedDataOfPv = loadDataLocalStore('dataOfPvs')
  if (storedDataOfPv) {
    dataOfPvs.value = storedDataOfPv
  }

  const storedDataOfWrsPvs = loadDataLocalStore('dataOfWrsPvs')
  if (storedDataOfWrsPvs) {
    dataOfWrsPvs.value = storedDataOfWrsPvs
  } else {
    dataOfWrs.value.forEach((wr) => {
      wr.wrInUse = false
    })

    dataOfPvs.value.forEach((pv) => {
      pv.pvInUse = false
    })
  }
})
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div id="formWrPv" class="card mt-4 mb-4 shadow">
        <div class="card-header">
          <button
            id="showFormWrPv"
            type="button"
            class="btn btn-secondary btn-sm float-end"
            @click="showFormWrPv = !showFormWrPv"
          >
            <i :class="`bi bi-${showFormWrPv ? 'dash-lg' : 'plus-lg'}`"></i>
          </button>
          <h4 class="card-title">
            <i class="bi bi-diagram-2"></i> Verbindung zw. Wechselrichter und Solarmodule
            {{ dataOfWrPv.id === null ? 'anlegen' : 'ändern' }}
          </h4>
          <h6 class="card-subtitle mb-2 text-body-secondary">
            Hier kannst Du die Verbindung des Wechselrichters (WR MPPT) mit den Solarmodulen (PV)
            {{ dataOfWrPv.id === null ? 'anlegen' : 'ändern' }}.
          </h6>
        </div>

        <Transition>
          <div v-show="showFormWrPv" class="card-body">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-12"></div>
                </div>
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text" id="selectWr">WR MPPT</span>

                      <select class="form-select" v-model="dataOfWrPv.dataWr">
                        <option v-for="(mppt, index) in allMpptsOfWrs" :key="index" :value="mppt">
                          {{ mppt.wrNameShort }} - MPPT {{ mppt.mpptIndex }} - [min.
                          {{ mppt.mpptMinU }} V, max. {{ mppt.mpptMaxU }} V, {{ mppt.mpptI }} A,
                          {{ mppt.mpptP }} Wp] - Module {{ mppt.mpptPvCount }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text" id="selectPv">PV</span>
                      <select class="form-select" v-model="dataOfWrPv.dataPv">
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

        <div class="card m-3">
          <div class="card-header h5"><i class="bi bi-diagram-2"></i> Verbindungen</div>
          <div class="card-body" v-if="dataCalculator.length > 0">
            <div
              class="row justify-content-center mppt"
              v-for="wr in dataCalculator"
              :key="wr.wrId"
            >
              <div class="col-12">
                <div class="card mb-3">
                  <div class="card-header mt-1">
                    <h5 class="card-title"><i class="bi bi-plug"></i> {{ wr.wrName }}</h5>
                    <!-- <h6 class="card-subtitle mb-2">
                      <pre>{{ wr.mppts }}</pre>
                    </h6> -->
                  </div>
                  <div class="card-body">
                    <!-- mppt -->
                    <div class="row">
                      <div class="col-12" v-for="(mppt, index) in wr.mppts" :key="mppt.mpptId">
                        <div class="card mb-3">
                          <div class="card-header h6">
                            MPPT {{ index + 1 }} - max. {{ mppt.mpptMaxU }} V, {{ mppt.mpptI }} A,
                            {{ wr.wrP }} W
                          </div>
                          <!-- Gruppen Info wenn mehr als 2 -->
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
                                angelegt wurden. Gruppen können
                                <strong>NICHT</strong> miteinander verbunden werden - nur jeweils
                                <strong>EINE GRUPPE</strong> mit diesem MPPT verbinden.
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
                                      <div class="col-12 mb-2">
                                        <div
                                          :class="`progress bg-${possibleStringsAsGroup.ifPvHigherElseMppt ? 'success' : 'dark'}`"
                                          role="progressbar"
                                          aria-label="Example with label"
                                          aria-valuenow="10"
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                          style="height: 30px"
                                        >
                                          <div
                                            v-if="possibleStringsAsGroup.ifPvHigherElseMppt"
                                            class="progress-bar bg-dark overflow-visible ps-2 text-start"
                                            :style="`width: ${100 - possibleStringsAsGroup.powerPercent}%`"
                                          >
                                            Die PV Leistung liegt mit
                                            {{ possibleStringsAsGroup.powerPercent }} % über der
                                            max. Watt des MPPTs. Der MPPT regelt anhand Spannung und
                                            Strom die Leistung ab.
                                          </div>
                                          <div
                                            v-else
                                            class="progress-bar bg-success overflow-visible ps-2 text-start"
                                            :style="`width: ${possibleStringsAsGroup.powerPercent}%`"
                                          >
                                            Die PV Leistung liegt mit
                                            {{ 100 - possibleStringsAsGroup.powerPercent }} %
                                            unterhalb der max. Watt des MPPTs.
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
                                            {{ possibleStringsAsGroup.primaryString.totalPower }}
                                            Wp
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
                                                  @click="showModal('wrspvs', modul.idWrsPvs)"
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
                                                  @click="showModal('wrspvs', modul.idWrsPvs)"
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
                            <ul class="list-group mb-3">
                              <li class="list-group-item list-group-item-warning">
                                Diese Module können <strong>nicht</strong> verwendet werden, da
                                aktuell nur 2 String erstellt werden können und diese bereits belegt
                                sind.
                              </li>
                              <li
                                class="list-group-item"
                                v-for="(modul, index) in mppt.result.toManyModules"
                                :key="index"
                              >
                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc, {{ modul.pvWp }} Wp
                                <button
                                  type="button"
                                  class="btn btn-danger btn-sm float-end"
                                  @click="showModal('wrspvs', modul.idWrsPvs)"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </li>
                            </ul>
                          </div>

                          <!-- nicht passende Module -->
                          <div class="card-body" v-if="mppt.result.notPossibleModules.length >= 1">
                            <ul class="list-group mb-3">
                              <li class="list-group-item list-group-item-danger">
                                Diese Module können mit diesem MPPT
                                <strong>nicht</strong> verwendet werden.
                              </li>
                              <li
                                class="list-group-item"
                                v-for="(modul, index) in mppt.result.notPossibleModules"
                                :key="index"
                              >
                                {{ modul.pvName }}, {{ modul.pvVoc }} Voc/Uoc, {{ modul.pvWp }} Wp
                                <button
                                  type="button"
                                  class="btn btn-danger btn-sm float-end"
                                  @click="showModal('wrspvs', modul.idWrsPvs)"
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
    <BsModal :data="dataModal" @click:delItem="delWrPv" />
  </div>
</template>

<style scoped>
.mppt > .col-12 > .card {
  background-color: #ced4da;
}
.mppt:nth-child(odd) > .col-12 > .card {
  color: #fff;
  background-color: #343a40;
}
</style>
