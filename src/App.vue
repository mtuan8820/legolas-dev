<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from './component/sidebar/SideBar.vue'

const route = useRoute()
</script>

<template>
  <Sidebar :desktop-hidden="!!route.meta.hideSidebar" />
  <main :class="{ 'main--wide': route.meta.hideSidebar }">
    <RouterView />
  </main>
</template>
