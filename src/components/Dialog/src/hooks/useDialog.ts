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
 */
export function useDialog(): UseDialog {
  const dialogInstance = ref<Nullable<InstanceType<typeof Dialog>>>(null)

  function useDialogHook(instance: InstanceType<typeof Dialog>) {
    dialogInstance.value = instance
  }

  function getInstance() {
    if (!dialogInstance.value) {
      /** 提示实例未挂载 */
      console.warn('dialog instance is undefined')
    }
    return dialogInstance.value
  }

  function showDialog() {
    getInstance()?.show?.()
  }

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
