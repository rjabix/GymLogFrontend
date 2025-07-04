import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import Trainings from '@/pages/Trainings.vue'
import Rankings from '@/pages/Rankings.vue'
import Trainers from '@/pages/Trainers.vue'
import AdminPanel from '@/pages/AdminPanel.vue'
import EditProfile from "@/pages/EditProfile.vue";
import TrainersZone from "@/pages/TrainersZone.vue";
import TrainingPage from "@/pages/TrainingPage.vue";
import AddTraining from "@/pages/AddTraining.vue";

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/trainings', component: Trainings },
  { path: '/rankings', component: Rankings },
  { path: '/trainers', component: Trainers },
  { path: '/admin', component: AdminPanel },
  { path: '/edit-profile', component: EditProfile },
  { path: '/trainers-zone', component: TrainersZone },
  { path: '/add-training', name: 'AddTraining', component: AddTraining }, // Route for adding a new training
  { path: '/training/:id', name: 'TrainingDetails', component: TrainingPage, props: true }, // Dynamic route for training details
  { path: '/:pathMatch(.*)*', redirect: '/profile' } // Catch-all route for undefined paths
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
