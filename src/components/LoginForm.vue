<!-- components/LoginForm.vue -->
<template>
  <div class="login-container">
    <div class="logo">
      <img src="/gymlog-pony.png" alt="GymLog Logo" />
    </div>
    <form class="login-form" @submit.prevent="login">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="hasło" />
      <button type="submit" class="submit-btn">Zaloguj</button>
      <div class="bottom-buttons">
        <button type="button">Zapomniałem hasło</button>
        <RouterLink to="/register" class="link-button">Utwórz konto</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()

const login = async () => {
  await auth.login(email.value, password.value)
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ece5d1;
  min-height: 100vh;
  gap: 60px;
  padding: 40px;
  box-sizing: border-box;
}

.logo img {
  width: 250px;
  height: auto;
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 280px;
  gap: 10px;
}

.login-form input {
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background-color: #f89ca7;
  color: white;
  outline: none;
}

.login-form input::placeholder {
  color: #ffeaea;
}

.submit-btn {
  background-color: #f36e7a;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
}

.bottom-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.bottom-buttons button,
.bottom-buttons .link-button {
  background-color: #f9b5be;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: white;
  text-decoration: none;
  text-align: center;
  display: inline-block;
}
</style>
