<template>
  <div class="edit-profile-container" data-aos="fade-up">
    <h1>Zmień dane</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-grid">
        <div class="form-group">
          <label for="name">Imię</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>
        <div class="form-group">
          <label for="surname">Nazwisko</label>
          <input id="surname" v-model="form.surname" type="text" required />
        </div>
        <div class="form-group">
          <label for="weight">Waga (kg)</label>
          <input id="weight" v-model="form.weight" type="number" required />
        </div>
        <div class="form-group">
          <label for="height">Wzrost (cm)</label>
          <input id="height" v-model="form.height" type="number" required />
        </div>
        <div class="form-group">
          <label for="gender">Płeć</label>
          <select id="gender" v-model="form.gender" required class="styled-select">
            <option value="">Wybierz</option>
            <option value="M">Mężczyzna</option>
            <option value="W">Kobieta</option>
            <option value="O">Inne</option>
          </select>
        </div>
        <div class="form-group">
          <label for="birth_date">Data urodzenia</label>
          <input id="birth_date" v-model="form.birth_date" type="date" required />
        </div>
      </div>
      <button type="submit" class="submit-btn">Zapisz zmiany</button>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const backend_url = 'http://localhost:8000' // Zmień na swój backend_url

const auth = useAuthStore()
const router = useRouter()
const message = ref('')

const form = reactive({
  name: auth.user?.name || '',
  surname: auth.user?.surname || '',
  weight: auth.user?.weight || '',
  height: auth.user?.height || '',
  gender: auth.user?.gender || '',
  birth_date: auth.user?.birth_date || ''
})

async function updateProfile() {
  try {
    await axios.put(
      `${backend_url}/users/update`,
      form,
      { withCredentials: true }
    )
    // Aktualizuj lokalnie
    auth.user = { ...auth.user, ...form }
    auth.saveToLocalStorage()
    alert('Dane profilu zostały zaktualizowane!')
    router.push('/profile')
  } catch (error) {
    alert('Błąd podczas aktualizacji profilu!')
    console.error(error)
  }
}
</script>

<style scoped>
.edit-profile-container {
  max-width: 500px;
  margin: auto auto;
  padding: 20px;
  background-color: #fdffe6;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-family: sans-serif;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  font-family: sans-serif;
}

input,
.styled-select {
  padding: 10px;
  border: 2px solid #f36e7a;
  border-radius: 10px;
  background: none;
}

.styled-select {
  /* Dopasuj wygląd selecta do inputa */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: none;
  font-size: 1rem;
  color: #333;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #f36e7a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #e85b6e;
}
</style>