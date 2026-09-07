<script lang="ts" setup>
import PostDetail from '@/component/postDetail/postDetail.vue'
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
        nextSlug.value = `/blogs/${dataNext.slug}`
        nextTitle.value = dataNext.title
      } else {
        nextSlug.value = '/til'
        nextTitle.value = 'Explore my Today I Learned'
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
        prevSlug.value = `/blogs/${prevSlug.value}`
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
    :tags="blog.tags"
    :prev-slug="prevSlug"
    :prev-title="prevTitle"
    :next-slug="nextSlug"
    :next-title="nextTitle"
  />
</template>
