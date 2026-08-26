<script lang="ts" setup>
import FootNav from '@/component/footNav/footNav.vue'
import { supabase, type Til } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const til = ref<Til | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const nextId = ref<number | null>(null)
const nextTitle = ref<string | null>(null)
const prevId = ref<number | null>(null)
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
        nextId.value = dataNext.id
        nextTitle.value = dataNext.title
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
        prevId.value = dataPrev.id
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
  <div v-if="loading" class="mt-2.5"><p>Loading...</p></div>

  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <div v-else-if="til">
    <h1>{{ til.title }}</h1>

    <div class="flex justify-between mt-4">
      <!-- Datetime -->
      <div class="text-[#555] font-extrabold">
        {{ datetimeFormatter.format(new Date(til.updated_at ?? til.created_at)) }}
      </div>

      <!-- Tags -->
      <div v-if="til.tags" class="flex gap-2">
        <span v-for="tag in til.tags" :key="tag" class="bg-[#e3e3e3] px-3 py-1 text-sm rounded">
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="mt-6" v-html="md.render(til.content)"></div>

    <FootNav
      :prev-post-link="prevId ? `/til/${prevId}` : undefined"
      :next-post-link="nextId ? `/til/${nextId}` : undefined"
      :prev-post-title="prevTitle ? prevTitle : undefined"
      :next-post-title="nextTitle ? nextTitle : undefined"
      index-page-link="/til"
    />
  </div>
</template>
