<script lang="ts" setup>
import { supabase } from '@/util/supabase'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  tableName: 'blogs' | 'til'
  title: string
  pageSize?: number
  detailRoute?: string // e.g., '/blogs/:slug' for blogs, undefined for TIL
  showExcerpt?: boolean
  callback?: () => string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 8,
  showExcerpt: false,
})

type ContentItem = {
  id?: number
  title: string
  slug?: string
  excerpt?: string
  summary?: string
  content?: string
  tags?: string[]
  updated_at?: string
  created_at?: string
}

const items = ref<ContentItem[]>([])
const error = ref<string | null>(null)
const loading = ref(true)
const totalPage = ref(0)
const pageIndex = ref(1)

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(date: string | undefined): string {
  if (!date) return ''
  return datetimeFormatter.format(new Date(date))
}

async function fetchContent(params: { page: number; tag?: string }) {
  const startOffset = (params.page - 1) * props.pageSize
  const endOffset = params.page * props.pageSize - 1

  try {
    // Determine which fields to select based on table
    let selectFields = 'updated_at, title, tags'
    if (props.tableName === 'blogs') {
      selectFields += ', slug, excerpt'
    } else if (props.tableName === 'til') {
      selectFields += ', summary'
    }

    let query = supabase
      .from(props.tableName)
      .select(selectFields, { count: 'estimated' })
      .order('updated_at', { ascending: false })

    // Filter by tag if provided
    if (params.tag) {
      query = query.overlaps('tags', [params.tag])
    }

    query = query.range(startOffset, endOffset)

    const { data, error: queryError, count } = await query

    if (!queryError) {
      items.value = data as unknown as ContentItem[]
      totalPage.value = count ? Math.ceil(count / props.pageSize) : 0
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
  fetchContent({ page: pageIndex.value, tag: selectedTag.value })
}
onMounted(loadPage)
watch([() => route.params.page, () => route.query.tag], loadPage)
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <hr class="mb-2.5 mt-7.5 bg-[#eee] border-0 h-px" />
    <div v-if="loading" class="mt-2.5">Loading {{ title.toLowerCase() }}...</div>

    <div v-if="error" class="text-red-600">Error: {{ error }}</div>

    <ul v-else-if="items.length > 0">
      <li v-for="item in items" :key="item.title" class="mt-4">
        <h2>
          <RouterLink
            v-if="detailRoute && item.slug"
            :to="{ path: detailRoute.replace(':slug', item.slug) }"
          >
            {{
              tableName == 'til'
                ? 'TIL: ' + formatDate(item.updated_at) + ': ' + item.title
                : item.title + '...'
            }}
          </RouterLink>
          <span v-else>{{
            tableName == 'til'
              ? 'TIL: ' + formatDate(item.updated_at) + ': ' + item.title
              : item.title + '...'
          }}</span>
        </h2>

        <div class="flex justify-between">
          <!-- Date time -->
          <div class="text-[#555]">{{ formatDate(item.updated_at ?? item.created_at) }}</div>

          <!-- tags -->
          <div v-if="item.tags" class="flex gap-2.5">
            <RouterLink
              v-for="tag in item.tags"
              :key="tag"
              :to="{ path: route.path, query: { tag } }"
              class="bg-[#e3e3e3] px-5 py-1.25 text-sm rounded-xs underline hover:bg-[#d0d0d0] transition"
            >
              {{ tag }}
            </RouterLink>
          </div>
        </div>

        <!-- excerpt or preview -->
        <p v-if="showExcerpt && item.excerpt">{{ item.excerpt }}</p>
        <p v-else-if="item.summary" class="line-clamp-2 text-[#222]]">
          {{ item.summary }}
        </p>
      </li>

      <div class="mt-5 flex justify-center gap-4">
        <RouterLink
          class="underline"
          v-if="pageIndex > 1"
          :to="{
            path: route.path.replace(`/page/${pageIndex}`, `/page/${pageIndex - 1}`),
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          ← Newer Posts
        </RouterLink>
        <RouterLink
          class="underline"
          v-if="pageIndex < totalPage"
          :to="{
            path: route.path.replace(`/page/${pageIndex}`, `/page/${pageIndex + 1}`),
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          Older Posts →
        </RouterLink>
      </div>
    </ul>
  </div>
</template>
