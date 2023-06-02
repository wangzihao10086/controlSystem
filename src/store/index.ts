import { defineStore } from 'pinia'

// useStore可以是任何类似useUser、useCart的东西
// 第一个参数是应用程序中 Store 的唯一id
interface StoreState {
  token: string | null | undefined
  // 这里的类型根据实际情况进行调整
  userInfo: {
    role?: string
  }
}

export const useStore = defineStore('store', {
  state: (): StoreState => {
    return {
      // 所有这些属性都将自动推断其数据类型
      token: localStorage.getItem('token') || '',
      userInfo: (localStorage.getItem('userInfo') as any) || {},
    }
  },
  getters: {
    getToken(state: StoreState): string | null | undefined {
      return state.token
    },
    getUserInfo(state: StoreState) {
      return state.userInfo
    },
    getRole(state: StoreState) {
      return state.userInfo.role as string
    },
  },
  actions: {
    setToken(token: string): void {
      // localStorage.setItem('token', token)
      this.token = token
    },
    setUserInfo(userInfo: object): void {
      this.userInfo = userInfo
    },
    clearToken(): void {
      this.token = null
    },
    clearUserInfo(): void {
      this.userInfo = {}
    },
  },
  persist: {
    // 开启持久化
    enabled: true,
    strategies: [
      {
        key: 'token',
        storage: localStorage,
        paths: ['token'],
      },
      {
        key: 'userInfo',
        storage: localStorage,
        paths: ['userInfo'],
      },
    ],
  },
})
