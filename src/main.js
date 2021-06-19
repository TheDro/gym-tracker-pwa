import './util.css'
import 'marx-css/css/marx.css'

import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from "./router";
import Button from "./components/Button.vue";
import Icon from "./components/Icon.vue";


let app = createApp(App)
app.component('Button', Button)
app.component('Icon', Icon)
app.use(router)
app.use(Toast)
app.mount('#app')
