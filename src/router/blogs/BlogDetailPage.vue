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
  <div v-if="loading" class="mt-2.5">Loading blog...</div>

  <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

  <div v-else-if="blog">
    <h1>{{ blog.title }}</h1>

    <div class="flex justify-between mt-4">
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

    <div class="mt-6" v-html="md.render(blog.content)"></div>
  </div>
</template>
