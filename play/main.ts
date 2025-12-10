import { createApp } from 'vue'
import App from './app.vue'

//import AxisUI from 'axis-ui'

import { Icon, Tree, Checkbox, Button, Input, FormItem, Form } from 'axis-ui'
const app = createApp(App)

//app.use(AxisUI)

app.use(Icon)
app.use(Tree)
app.use(Checkbox)
app.use(Button)
app.use(Input)
app.use(FormItem)
app.use(Form)

app.mount('#app')
