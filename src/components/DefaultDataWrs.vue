<template>
  <div>
    <div class="input-group mb-3">
      <span class="input-group-text" id="selectDefaultWr"
        >Vordefinierten Wechselrichter anlegen</span
      >
      <select v-model="selectWr" @change="handleChange" class="form-select form-select-sm">
        <option v-for="(wr, index) in defaultDataOfWrs" :key="index" :value="wr">
          {{ wr.wrName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'

const defaultDataOfWrs = [
  {
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
  },
  {
    wrId: null,
    wrName: 'AEConversion INV500-60',
    wrNameShort: 'INV500-60',
    wrMinU: 22,
    wrMaxU: 60,
    wrI: 9,
    wrP: 500,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrName: 'APsystems DS3',
    wrNameShort: 'DS3',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 12.5,
    wrP: 960,
    wrMppts: 2
  },
  {
    wrName: 'APsystems YC600',
    wrNameShort: 'YC600',
    wrMinU: 22,
    wrMaxU: 55,
    wrI: 12,
    wrP: 600,
    wrMppts: 2
  },
  {
    wrName: 'APsystems YC1000',
    wrNameShort: 'YC1000',
    wrMinU: 22,
    wrMaxU: 55,
    wrI: 25,
    wrP: 1000,
    wrMppts: 4
  },
  {
    wrName: 'Deye SUN1200G3',
    wrNameShort: 'SUN1200G3',
    wrMinU: 22,
    wrMaxU: 60,
    wrI: 20,
    wrP: 1200,
    wrMppts: 2
  },
  {
    wrName: 'Deye SUN1600G3',
    wrNameShort: 'SUN1600G3',
    wrMinU: 22,
    wrMaxU: 60,
    wrI: 26.6,
    wrP: 1600,
    wrMppts: 2
  },
  {
    wrName: 'Deye SUN600G3',
    wrNameShort: 'SUN600G3',
    wrMinU: 22,
    wrMaxU: 60,
    wrI: 10,
    wrP: 600,
    wrMppts: 2
  },
  {
    wrName: 'Deye SUN800G3',
    wrNameShort: 'SUN800G3',
    wrMinU: 22,
    wrMaxU: 60,
    wrI: 13.3,
    wrP: 800,
    wrMppts: 2
  },
  {
    wrName: 'Ecoflow Powerstream',
    wrNameShort: 'EF PS',
    wrMinU: 11,
    wrMaxU: 55,
    wrI: 13.0,
    wrP: 400,
    wrMppts: 2
  },
  {
    wrName: 'Envertech EVT560',
    wrNameShort: 'EVT560',
    wrMinU: 22,
    wrMaxU: 50,
    wrI: 12.8,
    wrP: 560,
    wrMppts: 1
  },
  {
    wrName: 'Envertech EVT800',
    wrNameShort: 'EVT800',
    wrMinU: 22,
    wrMaxU: 50,
    wrI: 18.2,
    wrP: 800,
    wrMppts: 1
  },
  {
    wrName: 'Hoymiles HM-1200',
    wrNameShort: 'HM-1200',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 24,
    wrP: 1200,
    wrMppts: 2
  },
  {
    wrName: 'Hoymiles HM-1600',
    wrNameShort: 'HM-1600',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 32,
    wrP: 1600,
    wrMppts: 4
  },
  {
    wrName: 'Hoymiles HM-600',
    wrNameShort: 'HM-600',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 11.6,
    wrP: 600,
    wrMppts: 2
  },
  {
    wrName: 'Hoymiles HM-800',
    wrNameShort: 'HM-800',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 16,
    wrP: 800,
    wrMppts: 2
  },
  {
    wrName: 'SMA Sunny Boy 300',
    wrNameShort: 'SB-300',
    wrMinU: 50,
    wrMaxU: 100,
    wrI: 5.5,
    wrP: 300,
    wrMppts: 1
  }
]

const selectWr = ref({})

const emit = defineEmits(['update:changeWr'])

const handleChange = () => {
  emit('update:changeWr', selectWr.value)
}
</script>

<style scoped></style>
