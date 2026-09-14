<script lang="ts" setup>
import PostDetail from '@/component/postDetail/postDetail.vue'
import { supabase, type Blog } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const lang = computed<'en' | 'ja'>(() => (route.meta.lang === 'ja' ? 'ja' : 'en'))
const blogsBasePath = computed(() => (lang.value === 'ja' ? '/blogs/jp' : '/blogs'))
const tilBasePath = computed(() => (lang.value === 'ja' ? '/til/jp' : '/til'))

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
      .eq('language', lang.value)
      .single()

    if (queryError) {
      error.value = queryError.message
    } else if (data) {
      blog.value = data as Blog

      const { data: dataNext, error: queryNextError } = await supabase
        .from('blogs')
        .select('slug, title')
        .eq('language', lang.value)
        .gt('created_at', blog.value.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (queryNextError) {
        // TODO: think about how to handle this
      } else if (dataNext) {
        nextSlug.value = `${blogsBasePath.value}/${dataNext.slug}`
        nextTitle.value = dataNext.title
      } else {
        nextSlug.value = tilBasePath.value
        nextTitle.value = 'Explore my Today I Learned'
      }
      const { data: dataPrev, error: queryPrevError } = await supabase
        .from('blogs')
        .select('slug, title')
        .eq('language', lang.value)
        .lt('created_at', blog.value.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (queryPrevError) {
        // TODO
      } else if (dataPrev) {
        prevSlug.value = `${blogsBasePath.value}/${dataPrev.slug}`
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
  <div v-if="loading" class="mt-2.5"><p>Loading…</p></div>
  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <PostDetail
    v-if="blog"
    :title="blog.title"
    :post-content="md.render(blog.content)"
    :date="datetimeFormatter.format(new Date(blog.updated_at ?? ''))"
    table-name="blogs"
    :lang="lang"
    :tags="blog.tags"
    :prev-slug="prevSlug"
    :prev-title="prevTitle"
    :next-slug="nextSlug"
    :next-title="nextTitle"
  />
</template>
