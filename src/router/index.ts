import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './about/AboutPage.vue'
import ProjectsPage from './projects/ProjectsPage.vue'
import BlogsPage from './blogs/BlogsPage.vue'
import TilPage from './til/TilPage.vue'
import TilDetailPage from './til/TilDetailPage.vue'
import BlogDetailPage from './blogs/BlogDetailPage.vue'

const routes = [
  { path: '/', component: AboutPage },
  { path: '/projects', component: ProjectsPage },
  { path: '/blogs', component: BlogsPage },
  { path: '/blogs/page/:page', component: BlogsPage, props: true },
  { path: '/blogs/jp', component: BlogsPage, meta: { lang: 'ja' } },
  { path: '/blogs/jp/page/:page', component: BlogsPage, props: true, meta: { lang: 'ja' } },
  { path: '/blogs/:slug', component: BlogDetailPage, props: true, meta: { hideSidebar: true } },
  {
    path: '/blogs/jp/:slug',
    component: BlogDetailPage,
    props: true,
    meta: { lang: 'ja', hideSidebar: true },
  },
  { path: '/til', component: TilPage },
  { path: '/til/jp', component: TilPage, meta: { lang: 'ja' } },
  { path: '/til/page/:page', component: TilPage, props: true },
  { path: '/til/jp/page/:page', component: TilPage, props: true, meta: { lang: 'ja' } },
  { path: '/til/:id', component: TilDetailPage, props: true, meta: { hideSidebar: true } },
  {
    path: '/til/jp/:id',
    component: TilDetailPage,
    props: true,
    meta: { lang: 'ja', hideSidebar: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
