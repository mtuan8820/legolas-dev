<script lang="ts" setup>
import { supabase, type Project } from '@/util/supabase'
import { ref, onMounted } from 'vue'
import { FunctionsHttpError } from '@supabase/supabase-js'
const projects = ref<Project[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchProjects() {
  loading.value = true
  error.value = null
  try {
    const { data, error: queryError } = await supabase.from('projects').select()

    if (!queryError) {
      projects.value = data
    } else {
      if (queryError instanceof FunctionsHttpError) {
        error.value = 'Function error'
      } else {
        error.value = queryError.message
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchProjects())
</script>

<template>
  <div class="projects-page">
    <h1>Projects</h1>
    <p class="mt-2.5">These are some of the projects I have worked on.</p>
    <div v-if="loading" class="mt-2.5">Loading projects...</div>
    <div v-if="error" class="error">
      Error: {{ error }}
      <button @click="fetchProjects">Try later</button>
    </div>

    <ul v-else-if="projects.length > 0" class="projects-list">
      <li v-for="project in projects" :key="project.id" class="">
        <hr class="mb-2.5 mt-7.5" />

        <div class="text-justify">
          <div class="float-left mr-2 mb-1.25 text-2xl font-bold max-w-[25%]">
            <a
              v-if="project.homepage_url"
              :href="project.homepage_url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ project.title }}
            </a>
            <span v-else>{{ project.title }}</span>
          </div>

          {{ project.description }}
        </div>

        <div class="flex justify-between mt-4">
          <!-- Github Link -->
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
          >
            GitHub
          </a>

          <!-- Techonologies List -->
          <div v-if="project.technologies" class="flex gap-2.5">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="bg-[#e3e3e3] px-5 py-1.25 text-sm rounded-xs"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
