<script lang="ts" setup>
import { supabase } from '@/util/supabase'
import type { QueryData } from '@supabase/supabase-js'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blogsQuery = supabase.from('blogs').select(`updated_at, title, slug, tags, excerpt`, {
  count: 'estimated',
})

const PAGE_SIZE = 8

type BlogsShort = QueryData<typeof blogsQuery>

const blogs = ref<BlogsShort>([])
const error = ref<string | null>(null)
const loading = ref(true)
const totalPage = ref(0)
const pageIndex = ref(1)

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(date: string): string {
  if (date == '') return ''
  const timestamp = new Date(date)
  return datetimeFormatter.format(timestamp)
}

async function fetchBlogs(params: { page: number; tag?: string }) {
  const startOffset = (params.page - 1) * PAGE_SIZE
  const endOffset = params.page * PAGE_SIZE - 1
  try {
    // Create a fresh query each time to avoid chaining issues
    let query = supabase
      .from('blogs')
      .select('updated_at, title, slug, tags, excerpt', { count: 'estimated' })
      .order('updated_at', { ascending: false })

    // Filter by tag if provided
    if (params.tag) {
      query = query.overlaps('tags', [params.tag])
    }

    query = query.range(startOffset, endOffset)

    const { data, error: queryError, count } = await query

    if (!queryError) {
      blogs.value = data
      totalPage.value = count ? Math.ceil(count / PAGE_SIZE) : 0
    } else {
      error.value = queryError.message
    }
  } finally {
    loading.value = false
  }
}
const route = useRoute()
const selectedTag = computed(() => (route.query.tag as string) || undefined)

const loadPage = () => {
  loading.value = true
  error.value = null
  pageIndex.value = parseInt((route.params.page as string) ?? '1', 10) || 1
  fetchBlogs({ page: pageIndex.value, tag: selectedTag.value })
}

onMounted(loadPage)
watch([() => route.params.page, () => route.query.tag], loadPage)
</script>

<template>
  <div>
    <h1>Blogs</h1>
    <hr class="mb-2.5 mt-7.5 bg-[#eee] border-0 h-px" />
    <div v-if="loading" class="mt-2.5">Loading blogs...</div>

    <div v-if="error">Error: {{ error }}</div>

    <ul v-else-if="blogs.length > 0">
      <li v-for="blog in blogs" :key="blog.title" class="mt-4">
        <h3>
          <RouterLink :to="{ path: `/blogs/${blog.slug}` }">{{
            blog.title.toUpperCase()
          }}</RouterLink>
        </h3>

        <div class="flex justify-between">
          <!-- Date time -->
          <div>{{ formatDate(blog.updated_at ?? '') }}</div>

          <!-- tags -->
          <div v-if="blog.tags" class="flex gap-2.5">
            <RouterLink
              v-for="tag in blog.tags"
              :key="tag"
              :to="{ path: '/blogs', query: { tag } }"
              class="bg-[#e3e3e3] px-5 py-1.25 text-sm rounded-xs underline hover:bg-[#d0d0d0] transition"
            >
              {{ tag }}
            </RouterLink>
          </div>
        </div>

        <!-- exercpt -->
        <p>{{ blog.excerpt }}</p>
      </li>

      <div class="mt-5 flex justify-center gap-4">
        <RouterLink
          class="underline"
          v-if="pageIndex > 1"
          :to="{
            path: `/blogs/page/${pageIndex - 1}`,
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          ← Newer Posts
        </RouterLink>
        <RouterLink
          class="underline"
          v-if="pageIndex < totalPage"
          :to="{
            path: `/blogs/page/${pageIndex + 1}`,
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          Older Posts →
        </RouterLink>
      </div>
    </ul>
  </div>
</template>
