<script setup lang="ts">
import Sidebar from './component/sidebar/SideBar.vue'
</script>

<template>
  <Sidebar />
  <main class="ml-64 mt-11.25">
    <RouterView class="p-8" />
  </main>
</template>
