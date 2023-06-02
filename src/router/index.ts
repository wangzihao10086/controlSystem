import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import { useStore } from "@/store/index";
const routes: RouteRecordRaw[] = [
  // {
  //   path: "/",
  //   redirect: "/login",
  // },
  {
    path: "/login",
    name: "login",
    meta: {
      requiresAuth: true,
      roles: ["admin", "user"],
      title: "adminAndUser",
    },
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      requiresAuth: true,
      roles: ["admin", "user"],
      title: "adminAndUser",
    },
    component: () => import("@/views/login/register.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/userMain",
        name: "userMain",
        meta: {
          title: "账号信息",
          requiresAuth: true,
          roles: ["user"],
          icon: "House",
        },
        component: () => import("@/views/user/main.vue"),
      },
      // {
      //   path: "/adminMain",
      //   redirect: "/qualification",
      // },
      {
        path: "/adminMain",
        component: () => import("@/views/admin/qualificationReview.vue"),
        meta: {
          requiresAuth: true,
          roles: ["admin"],
          title: "资质审核",
          icon: "House",
        },
      },
      {
        path: "/listing",
        component: () => import("@/views/admin/listingReview.vue"),
        meta: {
          requiresAuth: true,
          roles: ["admin"],
          title: "上架审核",
          icon: "Compass",
        },
      },
      {
        path: "/policy",
        component: () => import("@/views/admin/reviewPolicy.vue"),
        meta: {
          requiresAuth: true,
          roles: ["admin"],
          title: "审核规则",
          icon: "Aim",
        },
      },
      {
        path: "/projection",
        component: () => import("@/views/admin/screenProjectControl.vue"),
        meta: {
          requiresAuth: true,
          roles: ["admin"],
          title: "投屏管控",
          icon: "Monitor",
        },
      },
      {
        path: "/user/appService",
        component: () => import("@/views/user/appService.vue"),
        meta: {
          requiresAuth: true,
          roles: ["user"],
          icon: "Coin",
          title: "上架管理",
        },
      },
      {
        path: "/user2",
        component: () => import("@/views/user/user2.vue"),
        meta: {
          requiresAuth: true,
          roles: ["user"],
          icon: "Setting",
          title: "其他菜单",
        },
      },
      {
        path: "/403",
        component: () => import("@/views/others/403.vue"),
        meta: { requiresAuth: true, roles: ["admin", "user"], title: "403" },
      },
      // ...
      {
        path: "/404",
        component: () => import("@/views/others/404.vue"),
        meta: { requiresAuth: true, roles: ["admin", "user"], title: "404" },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const isAuthenticated = store.getToken !== undefined && store.getToken !== "";
  console.log(isAuthenticated, "==============");
  const requiredRoles: string[] = Array.isArray(to.meta.roles)
    ? to.meta.roles
    : [];

  if (to.path !== "/login" && to.path != "/register" && !isAuthenticated) {
    /** 未登录重定向到登录页 */
    console.log(to, from, "未登录");
    next("/login");
  } else if (isAuthenticated) {
    console.log(to, from, "index");
    /** 已经登录 还要去登录 重定向到main */
    if (to.path === "/login") {
      /** 根据角色去不同角色的首页 */
      if (store.getRole === "admin") {
        next("/adminMain");
      } else {
        next("/userMain");
      }
    } else {
      /** 如果store里面的role为空需要重新获取 */
      if (store.getRole.length === 0) {
        console.log("角色为空");
        store.setRole("user");
      }
      /** 已经登录(有token) 并且也有角色  根据权限处理*/
      const hasRole = requiredRoles.some((role) =>
        store.getRole.includes(role)
      );
      if (hasRole) {
        console.log(to, from, "hasRole");
        next();
      } else {
        console.log(to, from, "403");
        next("/403");
      }
    }
  } else {
    console.log(to, from, "next");
    next();
  }
});

export default router;
