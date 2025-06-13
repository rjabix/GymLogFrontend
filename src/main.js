import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import {useAuthStore} from "@/store/auth.js";


const app = createApp(App)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.loadFromLocalStorage()

app.mount('#app')
