<template>
  <div>
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text col-12 col-sm-6 col-lg-4" id="selectDefaultDevices"
        >Vordefinierte Geräte (inkl. Speicher)</span
      >
      <select v-model="selectDevice" @change="handleChange" class="form-select form-select-sm">
        <option v-for="(device, index) in defaultDataOfDevices" :key="index" :value="device">
          {{ device.wrName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue'

import { DataWr } from '../types/dataWr'

const defaultDataOfDevices: DataWr[] = [
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
    wrName: 'AlphaESS VitaPower VT1000',
    wrNameShort: 'VitaPower VT1000',
    wrMinU: 10,
    wrMaxU: 60,
    wrI: 16,
    wrP: 600,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix C1000',
    wrNameShort: 'Solix C1000',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 12.5,
    wrP: 600,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix F2000 (767)',
    wrNameShort: 'Solix F2000',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 20,
    wrP: 1000,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix F3800',
    wrNameShort: 'Solix F3800',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 25,
    wrP: 1200,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix Solarbank E1600',
    wrNameShort: 'Solarbank E1600',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 15,
    wrP: 400,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix Solarbank 2 E1600 Plus',
    wrNameShort: 'Solarbank 2 E1600 Plus',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 16,
    wrP: 600,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Anker Solix Solarbank 2 E1600 Pro',
    wrNameShort: 'Solarbank 2 E1600 Pro',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 16,
    wrP: 600,
    wrMppts: 4,
    wrInUse: false,
    mppts: []
  },

  {
    wrId: null,
    wrName: 'Ecoflow Delta 2',
    wrNameShort: 'EF D2',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 15,
    wrP: 500,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow Delta Max 1600',
    wrNameShort: 'EF DM 1600',
    wrMinU: 11,
    wrMaxU: 100,
    wrI: 13,
    wrP: 800,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow Delta Max 2000',
    wrNameShort: 'EF DM 2000',
    wrMinU: 11,
    wrMaxU: 100,
    wrI: 13,
    wrP: 800,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow Delta 2 Max',
    wrNameShort: 'EF D2M',
    wrMinU: 11,
    wrMaxU: 60,
    wrI: 15,
    wrP: 500,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow Delta Pro',
    wrNameShort: 'EF DP',
    wrMinU: 11,
    wrMaxU: 150,
    wrI: 15,
    wrP: 1600,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow River 2',
    wrNameShort: 'EF R2',
    wrMinU: 11,
    wrMaxU: 30,
    wrI: 8,
    wrP: 110,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow River 2 Max',
    wrNameShort: 'EF R2Max',
    wrMinU: 11,
    wrMaxU: 50,
    wrI: 13,
    wrP: 220,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Ecoflow River 2 Pro',
    wrNameShort: 'EF R2Pro',
    wrMinU: 11,
    wrMaxU: 50,
    wrI: 13,
    wrP: 220,
    wrMppts: 1,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Zendure SolarFlow Hub 1200',
    wrNameShort: 'SolarFlow Hub 1200',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 15,
    wrP: 650,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  },
  {
    wrId: null,
    wrName: 'Zendure SolarFlow Hub 2000',
    wrNameShort: 'SolarFlow Hub 2000',
    wrMinU: 16,
    wrMaxU: 60,
    wrI: 26,
    wrP: 1200,
    wrMppts: 2,
    wrInUse: false,
    mppts: []
  }
]

const selectDevice = ref({})

const emit = defineEmits(['update:changeWr'])

const handleChange = () => {
  emit('update:changeWr', selectDevice.value)
}
</script>

<style scoped></style>
