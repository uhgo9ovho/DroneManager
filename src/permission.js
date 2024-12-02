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

const whiteList = ['/login', '/register', '/videoMap']
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
  const path = to.path.substring(1);
  const orgArr = Cookies.get('orgList');
  activePath(path)
  NProgress.start()
  // next()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login' && !orgArr) {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
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
