import { ref } from 'vue'
import Dialog from '../Dialog.vue'
import { Nullable } from 'element-plus/es/components/cascader-panel/src/node'

type UseDialog = [
  (methods: InstanceType<typeof Dialog>) => void,
  {
    showDialog: () => void
    hideDialog: () => void
  }
]

/**
 * @description 对话框
 * @returns {UseDialog} 对话框相关方法和实例
 */
export function useDialog(): UseDialog {
  // 对话框实例引用
  const dialogInstance = ref<Nullable<InstanceType<typeof Dialog>>>(null)

  /**
   * @description 对话框实例挂载钩子
   * @param {InstanceType<typeof Dialog>} instance 对话框实例
   */
  function useDialogHook(instance: InstanceType<typeof Dialog>) {
    dialogInstance.value = instance
  }

  /**
   * @description 获取对话框实例
   * @returns {Nullable<InstanceType<typeof Dialog>>} 对话框实例
   */
  function getInstance(): Nullable<InstanceType<typeof Dialog>> {
    if (!dialogInstance.value) {
      // 提示实例未挂载
      console.warn('dialog instance is undefined')
    }
    return dialogInstance.value
  }

  /**
   * @description 显示对话框
   */
  function showDialog() {
    getInstance()?.show?.()
  }

  /**
   * @description 隐藏对话框
   */
  function hideDialog() {
    getInstance()?.hide?.()
  }

  return [
    useDialogHook,
    {
      showDialog,
      hideDialog,
    },
  ]
}
