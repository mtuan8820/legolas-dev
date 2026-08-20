<script lang="ts" setup>
import { supabase, type Blog } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const blog = ref<Blog | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const md = new MarkdownIt({ html: false, linkify: true })

onMounted(async () => {
  try {
    const { data, error: queryError } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', route.params.slug as string)
      .single()

    if (queryError) {
      error.value = queryError.message
    } else if (data) {
      blog.value = data as Blog
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load blog'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="mt-2.5"><p>Loading...</p></div>
  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <div v-else-if="blog">
    <h1>{{ blog.title }}</h1>

    <div class="flex justify-between mt-4 ml-48 mr-10">
      <!-- Datetime -->
      <div class="text-[#555] font-extrabold">
        {{ datetimeFormatter.format(new Date(blog.updated_at ?? '')) }}
      </div>

      <!-- Tags -->
      <div v-if="blog.tags" class="flex gap-2">
        <span v-for="tag in blog.tags" :key="tag" class="bg-[#e3e3e3] px-3 py-1 text-sm rounded">
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="content" v-html="md.render(blog.content)"></div>
  </div>
</template>

<style scoped>
h1 {
  margin-left: 12rem;
  font-family: 'Caslon-SC';
  text-transform: uppercase;
}

.content > :deep(h2) {
  float: left;
  margin-left: -13rem;
  margin-top: calc(var(--space-between-chapter) - var(--note01));
  text-align: end;
  width: 11rem;
  font-size: var(--note03);
  text-transform: uppercase;
}

.content > :deep(h2:first-of-type) {
  margin-top: 0;
}

.content > :deep(h3) {
  position: absolute;
  left: -13rem;
  text-align: end;
  width: 11rem;
  margin-top: 0;
  text-transform: lowercase;
  border-top: solid 3px #333;
  hyphens: none;
  line-height: 1.2;
  padding-top: 5px;
  font-weight: bold;
}

.content {
  padding: 3rem 0 18rem 0;
  margin-left: 12rem;
  margin-right: 2.5rem;
  position: relative;
  --space-between-chapter: var(--note10);
}

.content :deep(a) {
  color: #3366cc;
}

.content :deep(p) {
  margin-bottom: var(--note00);
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
</style>
