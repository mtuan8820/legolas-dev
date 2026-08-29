<script lang="ts" setup>
import FootNav from '@/component/footNav/footNav.vue'
import { supabase, type Blog } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const blog = ref<Blog | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const nextSlug = ref<string | null>(null)
const nextTitle = ref<string | null>(null)
const prevSlug = ref<string | null>(null)
const prevTitle = ref<string | null>(null)

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const md = new MarkdownIt({ html: true, linkify: true })

async function loadBlog() {
  loading.value = true
  error.value = null
  blog.value = null
  nextSlug.value = null
  prevSlug.value = null

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

      const { data: dataNext, error: queryNextError } = await supabase
        .from('blogs')
        .select('slug, title')
        .gt('created_at', blog.value.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (queryNextError) {
        // TODO: think about how to handle this
      } else if (dataNext) {
        nextSlug.value = dataNext.slug
        nextTitle.value = dataNext.title
      }
      const { data: dataPrev, error: queryPrevError } = await supabase
        .from('blogs')
        .select('slug, title')
        .lt('created_at', blog.value.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (queryPrevError) {
        // TODO
      } else if (dataPrev) {
        prevSlug.value = dataPrev.slug
        prevTitle.value = dataPrev.title
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load blog'
  } finally {
    loading.value = false
  }
}

onMounted(loadBlog)
watch(() => route.params.slug, loadBlog)
</script>

<template>
  <div v-if="loading" class="mt-2.5"><p>Loading...</p></div>
  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <div v-else-if="blog">
    <h1>{{ blog.title }}</h1>

    <div class="datetimetag">
      <!-- Datetime -->
      <div class="text-[#555] font-extrabold">
        {{ datetimeFormatter.format(new Date(blog.updated_at ?? '')) }}
      </div>

      <!-- Tags -->
      <div v-if="blog.tags" class="flex gap-2">
        <RouterLink
          v-for="tag in blog.tags"
          :key="tag"
          :to="{ path: '/blogs', query: { tag } }"
          class="bg-[#e3e3e3] px-3 py-1 text-sm rounded underline hover:bg-[#d0d0d0] transition"
        >
          {{ tag }}
        </RouterLink>
      </div>
    </div>

    <div class="content" v-html="md.render(blog.content)"></div>

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
