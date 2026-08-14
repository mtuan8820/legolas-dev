import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './about/AboutPage.vue'
import ProjectsPage from './projects/ProjectsPage.vue'
import BlogsPage from './blogs/BlogsPage.vue'
import TilPage from './til/TilPage.vue'
import BlogDetailPage from './blogs/BlogDetailPage.vue'

const routes = [
  { path: '/', component: AboutPage },
  { path: '/projects', component: ProjectsPage },
  { path: '/blogs', component: BlogsPage },
  { path: '/blogs/page/:page', component: BlogsPage, props: true },
  { path: '/blogs/:slug', component: BlogDetailPage, props: true },
  { path: '/til', component: TilPage }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
