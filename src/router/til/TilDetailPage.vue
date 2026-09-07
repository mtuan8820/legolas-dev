<script lang="ts" setup>
import PostDetail from '@/component/postDetail/postDetail.vue'
import { supabase, type Til } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const til = ref<Til | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const nextId = ref<string | null>(null)
const nextTitle = ref<string | null>(null)
const prevId = ref<string | null>(null)
const prevTitle = ref<string | null>(null)

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const md = new MarkdownIt({ html: true, linkify: true })

async function loadTil() {
  loading.value = true
  error.value = null
  til.value = null
  nextId.value = null
  nextTitle.value = null
  prevId.value = null
  prevTitle.value = null

  try {
    const { data, error: queryError } = await supabase
      .from('til')
      .select('*')
      .eq('id', Number(route.params.id))
      .single()

    if (queryError) {
      error.value = queryError.message
    } else if (data) {
      til.value = data as Til

      const { data: dataNext, error: queryNextError } = await supabase
        .from('til')
        .select('id, title')
        .gt('created_at', til.value.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (queryNextError) {
        // TODO: think about how to handle this
      } else if (dataNext) {
        nextId.value = `/til/${dataNext.id}`
        nextTitle.value = dataNext.title
      } else {
        nextId.value = '/blogs'
        nextTitle.value = 'Explore my Blogs'
      }

      const { data: dataPrev, error: queryPrevError } = await supabase
        .from('til')
        .select('id, title')
        .lt('created_at', til.value.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (queryPrevError) {
        // TODO
      } else if (dataPrev) {
        prevId.value = `/til/${dataPrev.id}`
        prevTitle.value = dataPrev.title
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load TIL entry'
  } finally {
    loading.value = false
  }
}

onMounted(loadTil)
watch(() => route.params.id, loadTil)
</script>

<template>
  <div v-if="loading" class="mt-2.5"><p>Loading…</p></div>

  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <div v-else-if="til">
    <PostDetail
      :next-slug="nextId"
      :prev-slug="prevId"
      :next-title="nextTitle"
      :prev-title="prevTitle"
      :post-content="md.render(til.content)"
      table-name="til"
      :title="til.title"
      :tags="til.tags"
      :date="datetimeFormatter.format(new Date(til.updated_at ?? til.created_at))"
    />
  </div>
</template>
