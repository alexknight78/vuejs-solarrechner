<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container-fluid">
    <div class="container">
      <header class="text-center">
        <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
        <h1>Solar Rechner</h1>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/calculator">Rechner</RouterLink>
        </nav>
      </header>
    </div>

    <RouterView />
  </div>
</template>

<style scoped></style>
