import { defineStore } from 'pinia'

// 定义用户状态管理 Store
export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  }),
  actions: {
    // 登录操作
    login(user: { username: string; password: string }) {
      this.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    // 注册操作
    register(user: { username: string; password: string }) {
      this.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    // 退出登录操作
    logout() {
      this.user = null
      sessionStorage.removeItem('user')
    },
  },
})
