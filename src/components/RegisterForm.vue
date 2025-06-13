<template>
  <div class="register-container">
    <div class="logo" data-aos="fade-right" data-aos-offset="300">
      <img src="/gymlog-pony.png" alt="GymLog Logo" />
    </div>
    <form class="register-form" @submit.prevent="submitForm" data-aos="zoom-out">
      <div class="form-grid">
        <input placeholder="imię *" v-model="firstName" />
        <input type="file" @change="uploadImage" />
        <input placeholder="nazwisko *" v-model="lastName" />
        <input placeholder="płeć" v-model="gender" />
        <input placeholder="adres e-mail *" v-model="email" />
        <input type="date" placeholder="data urodzenia" v-model="dob" />
        <input type="password" placeholder="hasło *" v-model="password" />
        <input type="number" placeholder="waga" v-model="weight" />
        <input type="password" placeholder="powtórz hasło *" v-model="confirmPassword" />
        <input type="number" placeholder="wzrost" v-model="height" />
      </div>
      <label class="checkbox">
        <input type="checkbox" v-model="accepted" />
        akceptuję regulamin i politykę prywatności
      </label>
      <button type="submit" class="submit-btn">utwórz konto</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from "axios";
import backend_url from "@/router/backend_url.js";

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const gender = ref('')
const dob = ref('')
const weight = ref('')
const height = ref('')
const accepted = ref(false)

const uploadImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    console.log('Uploaded:', file.name)
  }
}

const submitForm = () => {
  if (!accepted.value) return alert('Zaakceptuj regulamin!')
  if (password.value !== confirmPassword.value) return alert('Hasła nie są takie same!')
  alert('Wysłano formularz -- tu powinno byc wyslanie do API lub inna logika.')

  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    return alert('Wypełnij wszystkie wymagane pola!')
  }
  //TODO : Add validation for email format, password strength, etc.
  //TODO : Add support for sending image
  axios.post(backend_url + 'register', {
    firstName: firstName.value,
    surName: lastName.value,
    email: email.value,
    password: password.value,
    gender: gender.value,
    birth_date: dob.value,
    weight: weight.value,
    height: height.value
  })
    .then(response => {
      console.log('Registration successful:', response.data)
      alert('Konto zostało utworzone!')
    })
    .catch(error => {
      console.error('Error during registration:', error)
      alert('Wystąpił błąd podczas rejestracji.')
    })
}
</script>

<style scoped>
.register-container {
  display: flex;
  background-color: #ece5d1;
  padding: 20px;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.logo img {
  width: 150px;
  height: auto;
}

.register-form {
  background-color: #f36e7a;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 600px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-grid input {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: #f89ca7;
  color: white;
  font-size: 0.95rem;
}

.form-grid input::placeholder {
  color: #ffeaea;
}

.checkbox {
  font-size: 0.9rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-btn {
  background-color: #e85b6e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}
</style>
