// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '@mdi/font/css/materialdesignicons.css' 
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
library.add(fas) // Include needed icons

Vue.use(Vuetify)

const vuetify = new Vuetify({ 
    icons: {
        iconfont: 'mdi',
    },

    
})

export default vuetify;