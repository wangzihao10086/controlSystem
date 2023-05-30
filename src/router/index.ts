import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import { useStore } from '@/store/index';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresAuth: true,
      roles: ['admin', 'user'],
      title: 'adminAndUser',
    },
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/userMain',
        name: 'userMain',
        meta: {
          title: '用户首页',
          requiresAuth: true,
          roles: ['user'],
        },
        component: () => import('@/views/user/main.vue'),
      },
      {
        path: '/adminMain',
        name: 'adminMain',
        meta: {
          title: '管理员首页',
          requiresAuth: true,
          roles: ['admin'],
        },
        component: () => import('@/views/admin/main.vue'),
      },
      {
        path: '/admin1',
        component: () => import('@/views/admin/admin1.vue'),
        meta: { requiresAuth: true, roles: ['admin'], title: 'admin1' },
      },
      {
        path: '/admin2',
        component: () => import('@/views/admin/admin2.vue'),
        meta: { requiresAuth: true, roles: ['admin'], title: '管理员2' },
      },
      {
        path: '/user1',
        component: () => import('@/views/user/user1.vue'),
        meta: { requiresAuth: true, roles: ['user'], title: '用户1' },
      },
      {
        path: '/user2',
        component: () => import('@/views/user/user2.vue'),
        meta: { requiresAuth: true, roles: ['user'], title: '用户2' },
      },
      {
        path: '/403',
        component: () => import('@/views/others/403.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'user'], title: '403' },
      },
      // ...
      {
        path: '/404',
        component: () => import('@/views/others/404.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'user'], title: '404' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.getToken !== undefined && store.getToken !== ''
  const requiredRoles: string[] = Array.isArray(to.meta.roles)
    ? to.meta.roles
    : []

  if (to.path !== '/login' && !isAuthenticated) {
    /** 未登录重定向到登录页 */
    console.log(to, from, '未登录')
    next('/login')
  } else if (isAuthenticated) {
    console.log(to, from, 'index')
    /** 已经登录 还要去登录 重定向到main */
    if (to.path === '/login') {
      /** 根据角色去不同角色的首页 */
      if (store.getRole === 'admin') { 
        next('/adminMain')
      } else {
        next('/userMain')
      }
    } else {
      /** 如果store里面的role为空需要重新获取 */
      if (store.getRole.length === 0) {
        console.log('角色为空')
        store.setRole('user')
      }
      /** 已经登录(有token) 并且也有角色  根据权限处理*/
      const hasRole = requiredRoles.some((role) => store.getRole.includes(role))
      if (hasRole) {
        console.log(to, from, 'hasRole')
        next()
      } else {
        console.log(to, from, '403')
        next('/403')
      }
    }
  } else {
    console.log(to, from, 'next')
    next()
  }
})

export default router;
