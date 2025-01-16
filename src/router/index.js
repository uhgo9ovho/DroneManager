import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/videoMap',
    component: () => import('@/views/VideoMap'),
    hidden: true,
    meta: { auth: 'mngSide:index', auth: ["mngSide:airport", "wurenji:scheduling:fly", "wurenji:scheduling:fly"] },
    permissions: ["mngSide:airport", "wurenji:scheduling:fly", "wurenji:scheduling:fly"]
  },
  {
    path: '/wordPreview',
    component: () => import('@/views/WordPreview'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'el-icon-shouye', affix: true, auth: ['mngSide:index'] },
        active: true,
        permissions: ["mngSide:index"]
      },
      {
        path: 'flight',
        component: () => import('@/views/Flight.vue'),
        name: 'Flight',
        meta: { title: '飞行', icon: 'el-icon-guijifeihang', auth: ['mngSide:flight'] },
        active: false,
        permissions: ["mngSide:flight"]
      },
      {
        path: 'airport',
        component: () => import('@/views/Airport.vue'),
        name: 'Airport',
        meta: { title: '机场', icon: 'el-icon-hangpai', auth: ['mngSide:airport'] },
        active: false,
        permissions: ['mngSide:airport']
      },
      {
        path: 'data',
        component: () => import('@/views/Data.vue'),
        name: 'Data',
        meta: { title: '数据', icon: 'el-icon-shuju', auth: ['mngSide:data'] },
        active: false,
        permissions: ['mngSide:data']
      },
      // {
      //   path: 'plots',
      //   component: () => import('@/views/Plots.vue'),
      //   name: 'Plots',
      //   meta: { title: '地块', icon: 'el-icon-dikuai' },
      //   active: false,
      // },
      {
        path: 'contacts',
        component: () => import('@/views/Contacts.vue'),
        name: 'Contacts',
        meta: { title: '通讯录', icon: 'el-icon-tongxunlu', auth: ['mngSide:contacts'] },
        active: false,
        permissions: ['mngSide:contacts']
      },
      {
        path: 'orgList',
        component: () => import('@/views/OrgManager.vue'),
        name: 'OrgList',
        meta: { title: '组织管理', icon: 'el-icon-zuzhi', auth: ['mngSide:org'] },
        active: false,
        permissions: ['mngSide:org']
      },
      {
        path: 'deviceLogs',
        component: () => import('@/views/DeviceLogs.vue'),
        name: 'DeviceLogs',
        meta: { title: '设备日志', icon: 'el-icon-shebeirizhi', auth: ['mngSide:deviceLogs'] },
        active: false,
        permissions: ['mngSide:deviceLogs']
      },
      {
        path: 'openMap',
        component: () => import('@/views/OpenMap.vue'),
        name: 'OpenMap',
        meta: { title: '新建任务', icon: '', auth: ['wurenji:task:add'] },
        active: false,
        hidden: true,
        permissions: ['wurenji:task:add']
      },
    ]
  },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
