<template>
  <nav class="navbar" data-aos="fade-down">
    <div class="navbar-logo">
      <img src="/gymlog-pony.png" alt="GymLog Logo" />
    </div>
    <div class="navbar-links">
      <RouterLink to="/trainings" exact-active-class="active-link">Moje Treningi</RouterLink>
      <RouterLink to="/rankings" exact-active-class="active-link">Ranking</RouterLink>
      <RouterLink to="/trainers" exact-active-class="active-link">Trenerzy</RouterLink>
      <RouterLink v-if="isTrainerOrAdmin" to="/trainers-zone" active-class="active-link">Strefa Trenera</RouterLink>
    </div>
    <div class="navbar-icons">
      <RouterLink to="/profile" class="icon" active-class="active-link">
        <font-awesome-icon :icon="['fas', 'user']" />
      </RouterLink>
      <RouterLink to="/login" class="icon" @click.prevent="auth.logout()" active-class="active-link">
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
  text-decoration: none;
  padding: 8px 0;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
  background: #ea9999;
  letter-spacing: 1px;
  font-family: sans-serif;
  width: 300px;
  text-align: center;
  white-space: nowrap;
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

::v-deep(.active-link) {
  background-color: #e85b6e; /* Same as hover color */
}
</style>
