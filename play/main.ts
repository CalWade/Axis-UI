import { createApp } from 'vue'
import App from './app.vue'

//import AxisUI from 'axis-ui'

import { Icon, Tree, Checkbox, Button } from 'axis-ui'
const app = createApp(App)

//app.use(AxisUI)

app.use(Icon)
app.use(Tree)
app.use(Checkbox)
app.use(Button)

app.mount('#app')
