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
        ><span class="line-clamp-2">← {{ prevPostTitle }}</span></RouterLink
      >
      <RouterLink v-else to="/">Home</RouterLink>
    </div>

    <!-- To index button -->
    <div class="border-r border-gray-300">
      <RouterLink :to="$props.indexPageLink">Top</RouterLink>
    </div>

    <!-- Next Button -->
    <div class="w-[50%] text-right">
      <RouterLink v-if="$props.nextPostLink" :to="$props.nextPostLink"
        ><span class="line-clamp-2">{{ nextPostTitle }} →</span></RouterLink
      >
    </div>
  </nav>
</template>

<style scoped>
@reference "@/index.css";

.toolbar {
  line-height: 1.25;
  font-feature-settings: 'c2sc';
  @apply mt-20 text-(length:--note01) lg:text-(length:--note02);
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

span {
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
