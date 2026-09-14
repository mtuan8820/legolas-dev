<script lang="ts" setup>
import { supabase } from '@/util/supabase'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  tableName: 'blogs' | 'til'
  title: string
  pageSize?: number
  showExcerpt?: boolean
  callback?: () => string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 8, //number of posts (blog/til) per page
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

const route = useRoute()
const lang = computed<'en' | 'ja'>(() => (route.meta.lang === 'ja' ? 'ja' : 'en'))

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

function displayTitle(item: ContentItem): string {
  return props.tableName === 'til'
    ? 'TIL: ' + formatDate(item.updated_at) + ': ' + item.title
    : item.title
}

function resolveDetailPath(item: ContentItem): string | undefined {
  let path = '/' + props.tableName + '/'
  if (lang.value === 'ja') path += 'jp/'
  const slug = props.tableName === 'blogs' ? item.slug : String(item.id)
  path += slug

  return path
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
      selectFields += ', id, summary'
    }

    let query = supabase
      .from(props.tableName)
      .select(selectFields, { count: 'estimated' })
      .order('updated_at', { ascending: false })

    // Filter by tag if provided
    if (params.tag) {
      query = query.overlaps('tags', [params.tag])
    }

    query = query.eq('language', lang.value)

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

const selectedTag = computed(() => (route.query.tag as string) || undefined)

// Strips any existing "/page/N" suffix so we always build the target link
// from a clean base path, regardless of whether the current route has one.
function basePath(path: string): string {
  return path.replace(/\/page\/\d+$/, '')
}

function pageLink(page: number): string {
  const base = basePath(route.path)
  return page > 1 ? `${base}/page/${page}` : base
}

const loadPage = () => {
  loading.value = true
  error.value = null
  pageIndex.value = parseInt((route.params.page as string) ?? '1', 10) || 1
  fetchContent({ page: pageIndex.value, tag: selectedTag.value })
}
onMounted(loadPage)
watch([() => route.params.page, () => route.query.tag, () => route.meta.lang], loadPage)
</script>

<template>
  <div>
    <h1 v-if="selectedTag">Tag: {{ selectedTag }}</h1>
    <h1 v-else>{{ title }}</h1>
    <div class="flex justify-between mb-0! mt7.5!">
      <h4 class="">POSTS</h4>
      <div class="align-center">
        [
        <span v-if="lang === 'en'">en</span>
        <RouterLink v-else :to="`/${tableName}`" class="underline">en</RouterLink>
        |
        <span v-if="lang === 'ja'">ja</span>
        <RouterLink v-else :to="`/${tableName}/jp`" class="underline">ja</RouterLink>
        ]
      </div>
    </div>
    <hr class="mb-2.5 bg-[black] border-0 h-px" />
    <p v-if="loading">Loading {{ title.toLowerCase() }}…</p>
    <div v-if="error" class="text-red-600">Error: {{ error }}</div>

    <ul v-else-if="items.length > 0">
      <li v-for="item in items" :key="item.title" class="mt-4">
        <h2>
          <RouterLink
            v-if="resolveDetailPath(item)"
            :to="{ path: resolveDetailPath(item)! }"
            class="block line-clamp-2 lg:line-clamp-1"
          >
            {{ displayTitle(item) }}
          </RouterLink>
          <span v-else class="block line-clamp-2 lg:line-clamp-1">{{ displayTitle(item) }}</span>
        </h2>

        <div class="flex justify-between">
          <!-- Date time -->
          <div class="text-[#555]">{{ formatDate(item.updated_at ?? item.created_at) }}</div>

          <!-- tags -->
          <div v-if="item.tags" class="flex flex-wrap gap-2.5">
            <RouterLink
              v-for="tag in item.tags"
              :key="tag"
              :to="{ path: basePath(route.path), query: { tag } }"
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
            path: pageLink(pageIndex - 1),
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          ← Newer Posts
        </RouterLink>
        <RouterLink
          class="underline"
          v-if="pageIndex < totalPage"
          :to="{
            path: pageLink(pageIndex + 1),
            query: selectedTag ? { tag: selectedTag } : {},
          }"
        >
          Older Posts →
        </RouterLink>
      </div>
    </ul>
  </div>
</template>
