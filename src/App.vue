<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './util/supabase'

interface Todo {
  id: number
  task: string
  created_at: string
  completed: boolean
}

const todos = ref<Todo[]>([])

async function getTodos() {
  const { data, error } = await supabase.from('todos').select('*')

  if (error) {
    console.error(error)
    return
  }

  todos.value = data
}

onMounted(() => {
  getTodos()
})
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.task }}</li>
  </ul>
</template>
