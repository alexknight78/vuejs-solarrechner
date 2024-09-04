<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const navToggle = ref(false)

function navToogle(status) {
  console.log(status)
}
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <nav class="navbar navbar-expand-lg bg-body-secondary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">PV TOOL</a>
          <button
            id="navToggle"
            class="btn btn-sm d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
            @click="navToogle((navToggle = !navToggle))"
          >
            <i :class="`bi bi-${navToggle ? 'x-lg' : 'list'}`" style="font-size: 1.4rem"></i>
          </button>
          <div
            :class="`collapse navbar-collapse ${navToggle ? 'show' : ''}`"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav">
              <RouterLink to="/" class="nav-link"><i class="bi bi-house"></i> Home</RouterLink>

              <RouterLink to="/wechselrichter" class="nav-link"
                ><i class="bi bi-plug"></i> Wechselrichter</RouterLink
              >
              <RouterLink to="/solarmodule" class="nav-link"
                ><i class="bi bi-grid"></i> Solarmodule</RouterLink
              >
              <RouterLink to="/rechner" class="nav-link"
                ><i class="bi bi-diagram-2"></i> Verbindung</RouterLink
              >
              <!-- <RouterLink to="/calculator" class="nav-link"
                ><i class="bi bi-diagram-2"></i> Rechner</RouterLink
              > -->
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<style>
.router-link-active {
  color: #198754 !important;
}
.card-body {
  padding: 0.5rem;
}

@media (max-width: 991px) {
  .container {
    max-width: 100%;
  }
}
</style>
