<template>
  <div>
    <el-dialog v-model="visible" :title="status ? '编辑' : '查看'" width="50%" :before-close="putonDialogClose">
      <el-form ref="ruleFormRef" :model="putonInfo" :rules="rules" label-width="7.5rem" size="default" status-icon>
        <el-form-item label="应用名称" prop="appName">
          <el-input :disabled="!status" v-model="putonInfo.appName" />
        </el-form-item>
        <el-form-item label="应用简介" prop="appIntroduction">
          <el-input :disabled="!status" v-model="putonInfo.appIntroduction" />
        </el-form-item>
        <el-form-item label="主页" prop="companyHomePage">
          <el-input :disabled="!status" v-model="putonInfo.companyHomePage" />
        </el-form-item>
        <el-form-item label="appID" prop="appID">
          <el-input :disabled="!status" v-model="putonInfo.appID" />
        </el-form-item>
        <el-form-item label="appSecret" prop="appSecret">
          <el-input :disabled="!status" v-model="putonInfo.appSecret" />
        </el-form-item>
        <el-form-item label="备案号" prop="recordNum">
          <el-input :disabled="!status" v-model="putonInfo.recordNum" />
        </el-form-item>
        <el-form-item label="回调地址配置" prop="callBackUrl">
          <el-input :disabled="!status" v-model="putonInfo.callBackUrl" />
        </el-form-item>
        <el-form-item v-if="status" label="APK/SDK上传" prop="apkOrSdk">
          <el-upload :show-file-list="false" :http-request="uploadFile" :before-upload="fileCheck">
            <el-button size="large" type="primary">点击上传</el-button>
            <!-- <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过5MB
              </div>
                                          </template> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span v-if="status" class="dialog-footer">
          <el-button @click="putonDialogClose">取消</el-button>
          <el-button type="primary" @click="confirmPuton(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormInstance, FormRules, UploadRequestHandler } from 'element-plus'
const emit = defineEmits(['update:isShow'])
const props = defineProps<{
  /** 对话框的显隐 */
  isShow: boolean,
  /** 是否可编辑 */
  status: boolean
  /** 上架信息 */
  putonInfo: PutonInfo
}>()
/** 对话框的显隐 */
const visible = computed({
  get() {
    return props.isShow;
  },
  set(value) {
    emit('update:isShow', value)
  }
})
/** 上架信息接口定义 */
interface PutonInfo {
  /** 应用名称 */
  appName: string | null | undefined
  /** 应用简介 */
  appIntroduction: string | null | undefined
  /** 主页 */
  companyHomePage: string | null | undefined
  /** appID */
  appID: string | null | undefined
  /** appSecret */
  appSecret: string | null | undefined
  /** apk或者sdk */
  apkOrSdk?: any
  /** 备案号 */
  recordNum: string | null | undefined
  /** 回调地址 */
  callBackUrl?: string | null | undefined
}
/** 上架信息 */
const putonInfo = reactive(props.putonInfo)
/** 表单实例 */
const ruleFormRef = ref<FormInstance>()
//表单验证规则
const rules = reactive<FormRules>({
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  appIntroduction: [
    { required: true, message: '请输入应用简介', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  companyHomePage: [
    { required: true, message: '请输入公司主页', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  appID: [
    { required: true, message: '请输入appID', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  appSecret: [
    { required: true, message: '请输入appSecret', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  apkOrSdk: [
    { required: true, message: '请上传APK或者SDK', trigger: 'blur' },
  ],
  recordNum: [
    { required: true, message: '请输入备案号', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  callBackUrl: [
    { required: true, message: '请输入回调地址配置(appID+url)', trigger: 'blur' },
  ],
})
/** 关闭上架对话框 */
const putonDialogClose = () => {
  /** 清空表单规则 */
  ruleFormRef.value?.resetFields()
  visible.value = false
}
//确认上架
const confirmPuton = (FormEl: FormInstance | undefined) => {
  if (FormEl) {
    FormEl.validate((valid) => {
      if (valid) {
        /** 调用接口 */
        console.log('submit!')

        visible.value = false
      } else {
        ElMessage({
          message: '请检查表单是否填写完整',
          type: 'error',
        })
        return false
      }
    })
  }

}
/** 文件检查 */
const fileCheck = (file: File) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  // 判断类型
  if (fileExtension !== 'apk' && fileExtension !== 'sdk') {
    ElMessage({
      message: '只能上传APK或SDK文件',
      type: 'error',
    })
    return false
  }
  // 判断大小
  if (file.size > 5 * 1024 * 1024) {
    ElMessage({
      message: '大小不能超过5MB',
      type: 'error',
    })
    return false
  }
  putonInfo.apkOrSdk = 'w'
  //触发上传apk/sdk规则的验证
  ruleFormRef.value?.validateField('apkOrSdk')
}
//上传文件的事件
const uploadFile: UploadRequestHandler = (params): any => {
  console.log(params)
}
</script>
  
<style></style>