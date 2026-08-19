<script lang="ts" setup>
import { supabase, type Til } from '@/util/supabase'
import MarkdownIt from 'markdown-it'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const til = ref<Til | null>(null)
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
      .from('til')
      .select('*')
      .eq('id', Number(route.params.id))
      .single()

    if (queryError) {
      error.value = queryError.message
    } else if (data) {
      til.value = data as Til
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load TIL entry'
  } finally {
    loading.value = false
  }
})
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
  </div>
</template>
