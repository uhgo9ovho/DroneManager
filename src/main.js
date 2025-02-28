import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
import { debounce } from '@/utils/index.js'
import 'video.js/dist/video-js.css'
import './assets/icons' // icon
import './permission' // permission control
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
//引入自定义icon
import '../font_4643341_t35u7056jsq/iconfont.css'
import axios from 'axios'


// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$axios = axios;
Vue.use(plugins)
Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    const ariaEls = el.querySelectorAll('.el-radio__original')
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden')
    })
  }
})

//  按钮权限控制指令
Vue.directive('permissions', {
  inserted(el, binding) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = JSON.parse(localStorage.getItem('userPermission'))
    const permissionFlag = value;

    const hasPermissions = permissions.includes(permissionFlag) || all_permission == permissions[0];
    if (!hasPermissions) {
      console.log(el);
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
// ... existing code ...
Vue.prototype.$checkPermission = function(permissionFlag) {
  const all_permission = "*:*:*";
  const permissions = JSON.parse(localStorage.getItem('userPermission'))
  return permissions.includes(permissionFlag) || all_permission == permissions[0];
}
// ... existing code ...
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
