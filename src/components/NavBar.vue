<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="/gymlog-pony.png" alt="GymLog Logo" />
    </div>
    <div class="navbar-links">
      <RouterLink to="/trainings">Treningi</RouterLink>
      <RouterLink to="/rankings">Ranking</RouterLink>
      <RouterLink v-if="isTrainerOrAdmin" to="/trainers">Trenerzy</RouterLink>
      <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>
    </div>
    <div class="navbar-icons">
      <RouterLink to="/profile" class="icon">
        <font-awesome-icon :icon="['fas', 'user']" />
      </RouterLink>
      <RouterLink to="/login" class="icon" @click.prevent="auth.logout()">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import {RouterLink} from 'vue-router'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {useAuthStore} from '@/store/auth'
import {computed} from 'vue'

library.add(faUser, faSignOutAlt)

const auth = useAuthStore()

// Computed properties to reactively update based on auth state
const isAdmin = computed(() => auth.role === 'admin')
const isTrainerOrAdmin = computed(() => auth.role === 'trainer' || auth.role === 'admin')
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f36e7a;
  padding: 10px 52px;
  height: 80px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.navbar-logo img {
  height: 50px;
}

.navbar-links {
  display: flex;
  gap: 20px;
  margin: 0 auto;
}

.navbar-links a {
  color: white;
  font-size: larger;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}

.navbar-links a:hover, .navbar-icons a:hover {
  background-color: #e85b6e;
}

.navbar-icons {
  display: flex;
  gap: 20px;
  border-radius: 6px;
}

.icon {
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.1);
}
</style>
