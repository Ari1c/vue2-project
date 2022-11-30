// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import Pagination from "@/components/Pagination";
import { resetForm } from "@/utils/ruoyi";
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/element-variables.less'
import '@/assets/styles/ruoyi.less' // ruoyi css
import '@/assets/styles/index.less' // global css
import './permission'
import '@/assets/icons' // icon
import tab from '@/plugins/tab'

Vue.component('Pagination', Pagination)
Vue.prototype.resetForm = resetForm
Vue.prototype.$tab = tab
Vue.use(Element, {
  size: localStorage.size|| 'medium' // set element-ui default size
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,store,
  components: { App },
  template: '<App/>'
})
