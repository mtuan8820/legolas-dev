<script lang="ts" setup>
import FootNav from '@/component/footNav/footNav.vue'

interface Props {
  tableName: 'blogs' | 'til'
  title: string
  tags: string[] | null
  postContent: string
  date: string
  prevSlug?: string | null
  nextSlug?: string | null
  nextTitle?: string | null
  prevTitle?: string | null
}

defineProps<Props>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <div class="datetimetag">
      <!-- Datetime -->
      <div class="text-[#555] font-extrabold">
        {{ date }}
      </div>

      <!-- Tags -->
      <div v-if="tags" class="flex flex-wrap gap-2">
        <RouterLink
          v-for="tag in tags"
          :key="tag"
          :to="{ path: tableName === 'blogs' ? '/blogs' : '/til', query: { tag } }"
          class="bg-[#e3e3e3] px-3 py-1 text-sm rounded underline hover:bg-[#d0d0d0] transition"
        >
          {{ tag }}
        </RouterLink>
      </div>
    </div>

    <div class="content" v-html="postContent"></div>

    <FootNav
      :prev-post-link="prevSlug ? `/blogs/${prevSlug}` : undefined"
      :next-post-link="nextSlug ? `/blogs/${nextSlug}` : undefined"
      :prev-post-title="prevTitle ? prevTitle : undefined"
      :next-post-title="nextTitle ? nextTitle : undefined"
      index-page-link="/blogs"
    />
  </div>
</template>

<style scoped>
@reference "@/index.css";

h1 {
  @apply lg:ml-48;
  font-family: 'Caslon-SC';
  text-transform: uppercase;
}

.datetimetag {
  @apply flex justify-between mt-4;
  @apply lg:ml-48 lg:mr-10;
}

.content {
  @apply lg:ml-48 lg:mr-10 lg:pt-12 lg:pb-72;
  position: relative;
  --space-between-chapter: var(--note10);
}

.content > :deep(h2) {
  @apply float-none;
  @apply lg:float-left lg:-ml-52 lg:w-44 lg:text-end;
  margin-top: calc(var(--space-between-chapter) - var(--note01));
  font-size: var(--note03);
  text-transform: uppercase;
}

.content > :deep(h2:first-of-type) {
  margin-top: 0;
}

.content > :deep(h3) {
  @apply lg:absolute lg:-left-52 lg:text-end lg:w-44;
  margin-top: 0;
  text-transform: lowercase;
  border-top: solid 3px #333;
  hyphens: none;
  line-height: 1.2;
  padding-top: 5px;
  font-weight: bold;
}

.content :deep(a) {
  color: #3366cc;
}

.content :deep(p) {
  margin-bottom: var(--note00);
}

.content :deep(p:has(+ ul)) {
  margin-bottom: 0;
}

.content :deep(hr:has(+ h3)) {
  margin-top: 2em;
  border: none;
}

.content :deep(h2 + hr) {
  margin-top: var(--space-between-chapter);
  border: none;
}

.content :deep(h2:first-of-type + hr) {
  margin-top: 0;
  border: none;
}

.content :deep(ul) {
  list-style: disc;
  list-style-position: inside;
  margin-bottom: 0;
}

.content :deep(ul ul) {
  padding-left: 1.25em;
  list-style-type: circle;
}

.content :deep(ul ul ul) {
  padding-left: 1.25em;
  list-style-type: square;
}

.content :deep(strong) {
  font-family: valkyrie-caps;
  font-weight: normal;
  text-transform: lowercase;
}

.content :deep(li) {
  line-height: 1.618;
}

.content :deep(li > p) {
  display: inline;
  margin: 0;
}
</style>
