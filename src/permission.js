import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'
import { constantRoutes } from "@/router";
import Cookies from 'js-cookie';
NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/register', '/WordPreview'];
let routeList = constantRoutes.filter((item, index) => {
  return !item.hidden;
})[0].children;
function activePath(path) {

  routeList.forEach((element, idx) => {
    element.active = false;
    if (element.path == path || (element.path == 'flight' && path == 'openMap')) {
      element.active = true;
    }
  });
};
router.beforeEach((to, from, next) => {
  const userPermissions = JSON.parse(localStorage.getItem('userPermission'));
  const currentAuths = to.meta.auth;
  let hasCommonValue = true
  if (userPermissions && currentAuths) {
    hasCommonValue = userPermissions.some(value => currentAuths.includes(value));

  }
  const path = to.path.substring(1);
  const orgArr = Cookies.get('orgList');
  activePath(path)
  NProgress.start()
  const orgId = localStorage.getItem("org_id");
  // next()
  if (getToken() && orgId) {
    console.log(to);
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (userPermissions[0] == '*:*:*') {
        next()
      } else if (hasCommonValue) {
        next()
      } else {
        next({ path: '/' })
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
