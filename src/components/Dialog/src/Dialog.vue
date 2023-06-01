<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { usePropVModel } from '@/hooks/core/useVModel'

const props = withDefaults(
  defineProps<{
    /** 是否显示对话框 */
    modelValue?: boolean
    /** 是否居中显示 */
    alignCenter?: boolean
    /** Dialog 的自定义类名 */
    customClass?: string
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 确认按钮文本 */
    confirmButtonText?: string
    /** 确认按钮loading */
    confirmButtonLoading?: boolean
    /** 确认按钮禁用 */
    confirmButtonDisabled?: boolean
    /** 确认按钮配置 */
    confirmButtonOption?: Object
    /** 是否显示确认按钮 */
    showConfirmButton?: boolean
    /** 取消按钮文本 */
    cancelButtonText?: string
    /** 取消按钮配置 */
    cancelButtonOption?: Object
    /** 是否显示取消按钮 */
    showCancelButton?: boolean
    /** 是否显示底部 */
    showFooter?: boolean
  }>(),
  {
    modelValue: false,
    alignCenter: false,
    showClose: false,
    customClass: '',
    confirmButtonText: '确认',
    confirmButtonLoading: false,
    confirmButtonDisabled: false,
    cancelButtonText: '取消',
    showConfirmButton: true,
    showCancelButton: true,
    showFooter: true
  }
)

const emit = defineEmits<{
  (event: 'useHook', methods: any): void
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm', evt: MouseEvent): void
  (event: 'cancel', evt: MouseEvent): void
}>()

const ctx = getCurrentInstance()

// 是否显示对话框 v-model
const valueVModel = usePropVModel(props, 'modelValue')

// 显示对话框
function show() {
  valueVModel.value = true
}

// 隐藏对话框
function hide(e?: MouseEvent) {
  if (ctx?.vnode?.props?.onCancel) {
    emit('cancel', e!)
  } else {
    valueVModel.value = false
  }
}

emit('useHook', {
  hide() {
    valueVModel.value = false
  },
  show() {
    valueVModel.value = true
  }
})
defineExpose({ show, hide })
</script>



<template>
  <el-dialog :class="`dialog ${props.customClass}`" :show-close="props.showClose" v-bind="$attrs" v-model="valueVModel"
    :align-center="props.alignCenter">
    <template #[name]="data" v-for="name of Object.keys($slots)" :key="name">
      <slot :name="name" v-bind="data" :key="name"></slot>
    </template>
    <template v-if="props.showFooter" #footer>
      <slot name="footer">
        <el-button v-if="props.showCancelButton" type="info" plain class="min-w-[88px] min-h-[40px]" @click="hide"
          v-bind="props.cancelButtonOption">
          <span class="text-[14px] text-[#17181A] font-normal">{{ props.cancelButtonText }}</span>
        </el-button>
        <el-button v-if="props.showConfirmButton" type="primary" class="min-w-[88px] min-h-[40px]"
          :loading="props.confirmButtonLoading" :disabled="props.confirmButtonDisabled" @click="emit('confirm', $event)"
          v-bind="props.confirmButtonOption">
          <span class="text-[14px] text-white font-normal">{{ props.confirmButtonText }}</span>
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<style lang="scss"></style>
