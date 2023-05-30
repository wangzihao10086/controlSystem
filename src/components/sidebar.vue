<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in menu?.items" :key="item.index">
        <el-menu-item :index="item.path">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";
import router from "@/router";
import { ref, watch } from "vue";
import { useStore } from "@/store";
console.log(router);

/** 菜单项的接口 */
interface MenuItem {
  /** 图标 */
  icon?: string;
  /** 路径 */
  path: string;
  /** 标题 */
  title?: string;
  /** 子菜单项 */
  subs?: MenuItem[];
}

/** 菜单的接口 */
interface Menu {
  /** 菜单项 */
  items: MenuItem[];
}
/** 菜单生成器类 */
class MenuGenerator {
  /** pinia里面的store */
  private store: any;

  constructor(store: any) {
    this.store = store;
  }

  generateMenu(): Menu {
    const menu: Menu = {
      items: [],
    };
    /** 找到name为Home的 */
    const routerArray = router.options.routes;
    const home = routerArray.find((item) => item.name === "Home");
    console.log("home", home);
    /** 去除里面的403 404页面 */
    const homeChildren = home?.children?.filter(
      (item) => item?.meta?.title !== "403" && item?.meta?.title !== "404"
    );
    const routes = homeChildren;
    const authenticated =
      this.store.getToken !== undefined && this.store.getToken !== "";

    routes?.forEach((route) => {
      if (this.isRouteAuthorized(route, authenticated)) {
        const menuItem: MenuItem = {
          path: route.path,
          title: route.meta?.title as any,
        };

        if (route.meta?.roles) {
          menuItem.subs = this.generateSubMenu(route.children, authenticated);
        }

        menu.items.push(menuItem);
      }
    });

    return menu;
  }

  private isRouteAuthorized(route: any, authenticated: boolean): boolean {
    if (route.meta?.requiresAuth && !authenticated) {
      return false;
    }

    if (route.meta?.roles && route.meta.roles.length > 0) {
      return route.meta.roles.some((role: string) =>
        this.store.getRole.includes(role)
      );
    }

    return true;
  }

  private generateSubMenu(
    children: any[] | undefined,
    authenticated: boolean
  ): MenuItem[] {
    const subMenu: MenuItem[] = [];

    if (children) {
      children.forEach((child) => {
        if (this.isRouteAuthorized(child, authenticated)) {
          const menuItem: MenuItem = {
            path: child.path,
            title: child.meta?.title,
          };

          if (child.meta?.roles) {
            menuItem.subs = this.generateSubMenu(child.children, authenticated);
          }

          subMenu.push(menuItem);
        }
      });
    }

    return subMenu;
  }
}

const store = useStore();
const menu = ref<Menu | null>(null);
/** 取得store里面的role */
const role = computed(() => {
  return store.getRole;
});
//监听role的变化
watch(
  role,
  () => {
    const menuGenerator = new MenuGenerator(store);
    menu.value = menuGenerator.generateMenu();
    console.log("menu变化了");
    console.log("role", role);

    router.replace(`/${store.getRole}Main`);
  },
  {
    immediate: true,
  }
);

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
