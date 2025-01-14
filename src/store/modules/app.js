import Cookies from 'js-cookie'
import { handleTree } from '@/utils/ruoyi';
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
    hide: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  addFilter: false,
  managerPermissions: [],  //管理
  screenPermissions: [],   //大屏
  programsPermissions: [] //小程序
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    if (state.sidebar.hide) {
      return false;
    }
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SIDEBAR_HIDE: (state, status) => {
    state.sidebar.hide = status
  },
  //弹窗添加蒙层
  SET_FILTER_BULR(state, flag) {
    state.addFilter = flag;
  },
  GET_PERMISSION(state, values) {
    const formatManagerList = values[0].data.map(item => {
      return {
        parentId: item.parentId,
        menuId: item.menuId,
        menuName: item.menuName,
        path: item.path,
        perms: item.perms
      }
    })
    const formatScreenList = values[1].data.map(item => {
      return {
        parentId: item.parentId,
        menuId: item.menuId,
        menuName: item.menuName,
        path: item.path,
        perms: item.perms
      }
    })
    const formatProgramsList = values[2].data.map(item => {
      return {
        parentId: item.parentId,
        menuId: item.menuId,
        menuName: item.menuName,
        path: item.path,
        perms: item.perms
      }
    })
    state.managerPermissions = handleTree(formatManagerList, 'menuId', 'parentId');
    state.screenPermissions = handleTree(formatScreenList, 'menuId', 'parentId');
    state.programsPermissions = handleTree(formatProgramsList, 'menuId', 'parentId');

  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  toggleSideBarHide({ commit }, status) {
    commit('SET_SIDEBAR_HIDE', status)
  },
  //获取所有权限
  GetPermissionsList({ commit }, values) {
    commit('GET_PERMISSION', values);

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
