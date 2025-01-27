import { createApp } from 'vue'

import App from './App.vue'

import './assets/main.css'

const app = createApp(App)
app.config.globalProperties.window = window as Window
app.mount('#app')
