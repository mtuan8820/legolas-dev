<script lang="ts" setup>
defineProps<{
  prevPostLink?: string
  prevPostTitle?: string
  nextPostLink?: string
  nextPostTitle?: string
  indexPageLink: string
}>()
</script>

<template>
  <nav class="border-t border-gray-300 w-full flex toolbar h-14 no-wrap">
    <!-- Prev Button -->
    <div class="w-[50%] border-r border-gray-300">
      <RouterLink v-if="$props.prevPostLink" :to="$props.prevPostLink"
        >← {{ prevPostTitle }}</RouterLink
      >
      <RouterLink v-else to="/blogs">Home</RouterLink>
    </div>

    <!-- To index button -->
    <div class="border-r border-gray-300">
      <RouterLink :to="$props.indexPageLink">Top</RouterLink>
    </div>

    <!-- Next Button -->
    <div class="w-[50%] text-right">
      <RouterLink v-if="$props.nextPostLink" :to="$props.nextPostLink"
        >{{ nextPostTitle }} →</RouterLink
      >
    </div>
  </nav>
</template>

<style scoped>
@reference "@/index.css";

.toolbar {
  font-size: var(--note02);
  line-height: 1.25;
  font-feature-settings: 'c2sc';
  @apply mt-20;
}

nav {
  color: gray;
}

a {
  width: 100%;
  height: 100%;
  display: block;
  padding: 0.5em 0.5em 1em 0.5em;
  font-family: heliotrope-caps;
}

a:hover {
  color: black;
  background: #fbf3f3;
  background-color: rgb(251, 243, 243);
  transition-property: background;
  transition-duration: 0.2s;
  border-radius: 8px;
}
</style>
