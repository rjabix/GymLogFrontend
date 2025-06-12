import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import Trainings from '@/pages/Trainings.vue'
import Rankings from '@/pages/Rankings.vue'
import Trainers from '@/pages/Trainers.vue'
import AdminPanel from '@/pages/AdminPanel.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/trainings', component: Trainings },
  { path: '/rankings', component: Rankings },
  { path: '/trainers', component: Trainers },
  { path: '/admin', component: AdminPanel }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
