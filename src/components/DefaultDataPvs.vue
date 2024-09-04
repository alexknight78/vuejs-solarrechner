<template>
  <div>
    <div class="input-group mb-3">
      <span class="input-group-text" id="selectDefaultPv">Vordefiniertes Solarmodul wählen</span>
      <select v-model="selectPv" @change="handleChange" class="form-select form-select-sm">
        <option v-for="(pv, index) in defaultDataOfPvs" :key="index" :value="pv">
          {{ pv.pvName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'

const defaultDataOfPvs = [
  {
    pvId: null,
    pvName: '',
    pvWp: null,
    pvVmp: null,
    pvImp: null,
    pvVoc: null,
    pvIk: null,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Canadian Solar CS3W-400MS',
    pvWp: 400,
    pvVmp: 31.4,
    pvImp: 12.74,
    pvVoc: 38.5,
    pvIk: 13.48,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Canadian Solar CS3W-410MS',
    pvWp: 410,
    pvVmp: 31.5,
    pvImp: 13.02,
    pvVoc: 38.7,
    pvIk: 13.77,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Canadian Solar CS3W-415MS',
    pvWp: 415,
    pvVmp: 31.6,
    pvImp: 13.14,
    pvVoc: 38.9,
    pvIk: 13.91,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Canadian Solar CS3W-420MS',
    pvWp: 420,
    pvVmp: 31.7,
    pvImp: 13.25,
    pvVoc: 39.0,
    pvIk: 14.04,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 60W Portable Solar Panel',
    pvWp: 60,
    pvVmp: 20.4,
    pvImp: 3.0,
    pvVoc: 25.6,
    pvIk: 3.3,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 100W Portable Solar Panel',
    pvWp: 100,
    pvVmp: 18.4,
    pvImp: 5.4,
    pvVoc: 21.7,
    pvIk: 5.9,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 110W Portable Solar Panel',
    pvWp: 110,
    pvVmp: 19.0,
    pvImp: 5.8,
    pvVoc: 21.8,
    pvIk: 6.0,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 220W Portable Solar Panel',
    pvWp: 220,
    pvVmp: 30.3,
    pvImp: 7.2,
    pvVoc: 38.3,
    pvIk: 7.7,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 400W Portable Solar Panel',
    pvWp: 400,
    pvVmp: 37.5,
    pvImp: 10.6,
    pvVoc: 48.0,
    pvIk: 11.0,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'EcoFlow 400W Starres Solarpanel',
    pvWp: 400,
    pvVmp: 44.3,
    pvImp: 9.04,
    pvVoc: 37.1,
    pvIk: 13.79,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-375/MR',
    pvWp: 375,
    pvVmp: 34.1,
    pvImp: 11.0,
    pvVoc: 40.9,
    pvIk: 11.7,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-385/MR',
    pvWp: 385,
    pvVmp: 34.5,
    pvImp: 11.16,
    pvVoc: 41.2,
    pvIk: 11.7,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-390/MR',
    pvWp: 390,
    pvVmp: 34.7,
    pvImp: 11.23,
    pvVoc: 41.4,
    pvIk: 11.8,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-395/MR',
    pvWp: 395,
    pvVmp: 34.9,
    pvImp: 11.32,
    pvVoc: 41.6,
    pvIk: 11.9,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-400/MR',
    pvWp: 400,
    pvVmp: 34.6,
    pvImp: 11.56,
    pvVoc: 41.5,
    pvIk: 12.12,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM60S20-405/MR',
    pvWp: 405,
    pvVmp: 34.7,
    pvImp: 11.67,
    pvVoc: 41.7,
    pvIk: 12.25,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM72S30-415/MR',
    pvWp: 415,
    pvVmp: 34.8,
    pvImp: 11.93,
    pvVoc: 42.0,
    pvIk: 12.58,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM72S30-420/MR',
    pvWp: 420,
    pvVmp: 34.9,
    pvImp: 12.04,
    pvVoc: 42.2,
    pvIk: 12.72,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM72S30-440/MR',
    pvWp: 440,
    pvVmp: 35.1,
    pvImp: 12.53,
    pvVoc: 42.5,
    pvIk: 13.24,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Ja Solar JAM72S30-450/MR',
    pvWp: 450,
    pvVmp: 35.3,
    pvImp: 12.74,
    pvVoc: 42.8,
    pvIk: 13.45,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 395W',
    pvWp: 395,
    pvVmp: 34.2,
    pvImp: 11.55,
    pvVoc: 40.8,
    pvIk: 12.1,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 400W',
    pvWp: 400,
    pvVmp: 34.3,
    pvImp: 11.65,
    pvVoc: 41.0,
    pvIk: 12.2,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 405W',
    pvWp: 405,
    pvVmp: 34.4,
    pvImp: 11.78,
    pvVoc: 41.2,
    pvIk: 12.4,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 410W',
    pvWp: 410,
    pvVmp: 34.5,
    pvImp: 11.88,
    pvVoc: 41.4,
    pvIk: 12.5,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 435W',
    pvWp: 435,
    pvVmp: 41.0,
    pvImp: 10.61,
    pvVoc: 48.5,
    pvIk: 11.3,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 440W',
    pvWp: 440,
    pvVmp: 41.2,
    pvImp: 10.69,
    pvVoc: 48.8,
    pvIk: 11.5,
    pvInUse: false
  },
  {
    pvId: null,
    pvName: 'Trina Solar TSM-DE09.08(II) 450W',
    pvWp: 450,
    pvVmp: 41.6,
    pvImp: 10.81,
    pvVoc: 49.3,
    pvIk: 11.7,
    pvInUse: false
  }
]

const selectPv = ref({})

const emit = defineEmits(['update:changePv'])

const handleChange = () => {
  emit('update:changePv', selectPv.value)
}
</script>

<style scoped></style>
