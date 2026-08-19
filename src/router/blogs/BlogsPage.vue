<script lang="ts" setup>
import PostListing from '@/component/postListing/PostListing.vue'
</script>

<template>
  <PostListing title="Blogs" table-name="blogs" detail-route="/blogs/:slug" show-excerpt />
</template>
