<template>
  <Dialog :width="744" top="50px" v-model="visibleDialog" v-bind="$attrs" :alignCenter="true" :showFooter="true"
    destroy-on-close>
  </Dialog>
</template>
  
<script setup lang='ts'>
import { Dialog } from '@/components/Dialog'
import { ref } from 'vue'
const visibleDialog = ref(false)
const emit = defineEmits<{
  (event: 'useHook', methods: any): void
}>()

emit('useHook', {
  hide() {
    closeDialog()
  },
  show() {
    visibleDialog.value = true
  }
})
// 关闭弹窗
const closeDialog = () => {
  visibleDialog.value = false
}

</script>
  
<style></style>