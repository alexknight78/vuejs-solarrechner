<template>
  <div>
    <div
      :class="`modal fade ${props.data.id !== null ? 'show' : ''}`"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style="display: none"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Eintrag löschen</h1>
          </div>
          <div class="modal-body">
            Möchtest Du wirklich
            <strong
              >{{
                props.data.key === 'wrspvs'
                  ? 'die Verbindung zwischen MPPT und Solarmodul'
                  : props.data.key === 'pv'
                    ? 'das Solarmodul'
                    : props.data.key === 'wr'
                      ? 'das Gerät / den Wechselrichter'
                      : ''
              }}
              löschen</strong
            >?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="handleClickDel({ key: '', id: null })"
              data-bs-dismiss="modal"
            >
              ABBRECHEN
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="handleClickDel(props.data)"
            >
              LÖSCHEN
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data'])

const emit = defineEmits(['click:delItem'])

const handleClickDel = (data) => {
  emit('click:delItem', data.id)
}
</script>

<style scoped>
.modal.show {
  display: block !important;
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
