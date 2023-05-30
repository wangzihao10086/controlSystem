
import { defineStore } from 'pinia'
// useStore可以是任何类似useUser、useCart的东西
// 第一个参数是应用程序中 Store 的唯一id
interface StoreState {
  token: string
  userInfo: Record<string, unknown> // 这里的类型根据实际情况进行调整
  role: string
}

export const useStore = defineStore('store', {
  state: ():StoreState => {
    return {
      // 所有这些属性都将自动推断其数据类型
      token: localStorage.getItem('token') || '',
      userInfo: {},
      role: localStorage.getItem('role') || '',
    }
  },
  getters: {
    getToken(state: StoreState): string {
      return state.token
    },
    getRole(state: StoreState): string {
      return state.role
    },
  },
  actions: {
    setToken(token: string): void {
      localStorage.setItem('token', token)
      this.token = token
    },
    setRole(role: string): void {
      localStorage.setItem('role', role)
      this.role = role
    },
  },
})
