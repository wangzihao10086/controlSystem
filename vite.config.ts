import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 自动导入vue中hook reactive ref等
import AutoImport from 'unplugin-auto-import/vite'
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      vue(),
      VueSetupExtend(),
      UnoCSS(),
    ],
    // vite 配置
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    // 反向代理
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          // 将请求中/api用空值替换重写，根据实际业务修改
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
