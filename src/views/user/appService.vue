
<template>
  <div>
    <!-- //^ ^--------------搜索栏配置-------------^ ^ -->
    <el-form :inline="true" :model="searchForm" label-width="100px" size="large">
      <el-form-item label-width="100px" label="名称">
        <el-input v-model="searchForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="appID">
        <el-input v-model="searchForm.appID" placeholder="请输入appID"></el-input>
      </el-form-item>
      <el-form-item label="备案号">
        <el-input v-model="searchForm.recordNum" placeholder="请输入备案号"></el-input>
      </el-form-item>
      <el-form-item :span="40">
        <el-button icon="search" type="primary" @click="handleSearch">搜索</el-button>
        <el-button icon="delete" @click="handleClear">清空</el-button>
      </el-form-item>
    </el-form>
    <el-button class="w-[100px] " type="primary" size="large" @click="putonDialog = true">创建应用</el-button>
    <div class="mt-[20px]">
      <!-- //^ ^--------------表格start-------------^ ^ -->
      <el-table :inline="true" :data="tableList" border style="width: 100%">
        <el-table-column prop="appName" label="应用名称" />
        <el-table-column prop="appIntroduction" label="应用简介" />
        <el-table-column prop="companyHomePage" label="主页" />
        <el-table-column prop="appID" label="appID" />
        <el-table-column prop="recordNum" label="备案号" />
        <el-table-column prop="applicationStatus" label="审核状态">
          <template #default="{ row }">
            <el-tag v-if="row.applicationStatus === '待审核'" size="large" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.applicationStatus === '通过'" size="large" type="success">审核通过</el-tag>
            <div v-else-if="row.applicationStatus === '拒绝'" size="large">
              <el-tag type="danger" size="large">审核不通过</el-tag>
              <div>
                原因：{{ row.applicationReason }}
              </div>
            <!-- <el-popover placement="top-start" :width="200" trigger="hover" :content="row.applicationReason">
                <template #reference>
                  <el-tag type="danger" size="large">审核不通过</el-tag>
                </template>
                                                                                                                                                                                                                                                                                    </el-popover> -->
            </div>

          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default>
            <div>
              <el-button type="primary" size="large" @click="() => { sonDialog = true, isEdit = false }">查看</el-button>
              <el-button type="primary" size="large" @click="() => { sonDialog = true, isEdit = true }">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- //^ ^--------------表格end-------------^ ^ -->
    </div>
    <!-- //^ ^--------------上架的对话框-------------^ ^ -->
    <el-dialog v-model="putonDialog" title="创建应用" width="50%" :before-close="putonDialogClose">
      <el-form ref="ruleFormRef" :model="putonInfo" :rules="rules" label-width="7.5rem" size="default" status-icon>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="putonInfo.appName" />
        </el-form-item>
        <el-form-item label="应用简介" prop="appIntroduction">
          <el-input v-model="putonInfo.appIntroduction" />
        </el-form-item>
        <el-form-item label="主页" prop="companyHomePage">
          <el-input v-model="putonInfo.companyHomePage" />
        </el-form-item>
        <el-form-item label="appID" prop="appID">
          <el-input v-model="putonInfo.appID" />
        </el-form-item>
        <el-form-item label="appSecret" prop="appSecret">
          <el-input v-model="putonInfo.appSecret" />
        </el-form-item>
        <el-form-item label="备案号" prop="recordNum">
          <el-input v-model="putonInfo.recordNum" />
        </el-form-item>
        <el-form-item label="回调地址配置" prop="callBackUrl">
          <el-input v-model="putonInfo.callBackUrl" />
        </el-form-item>
        <el-form-item label="APK/SDK上传" prop="apkOrSdk">
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
        <span class="dialog-footer">
          <el-button @click="putonDialogClose">取消</el-button>
          <el-button type="primary" @click="confirmPuton(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- //^ ^--------------查看/编辑详情的对话框start-------------^ ^ -->
    <Dialog :puton-info="tableList[0]" :status="isEdit" v-model:isShow="sonDialog"></Dialog>
    <!-- <TestDialog @use-hook="MyHook"></TestDialog> -->
    <!-- //^ ^--------------查看/编辑详情的对话框end-------------^ ^ -->
  </div>
</template>
  
<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules, UploadRequestHandler } from 'element-plus'
import Dialog from '../user/components/appService-dialog.vue'
// import {
//   TestDialog
// } from '@/components/Dialog'
// import { useDialog } from '@/components/Dialog'
// const [MyHook, { showDialog: showTestDialog }] = useDialog()

/** 搜索栏接口 */
interface SearchForm {
  /** 名称 */
  name: string | null | undefined
  /** appID */
  appID: string | null | undefined
  /** 备案号 */
  recordNum: string | null | undefined
  /** 当前页 */
  current: number | null | undefined
  /** 每页条数 */
  size: number | null | undefined
  /** 总数 */
  total: number | null | undefined
}
/** 每一行表格数据定义 */
interface TableItem {
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
  /** 备案号 */
  recordNum: string | null | undefined
  /** 审核状态 */
  applicationStatus: string | null | undefined
  /** 拒绝原因 */
  applicationReason?: string | null | undefined
  /** apk/sdk */
  apkOrSdk?: any
  /** 回调地址 */
  callBackUrl?: string | null | undefined
}
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
  apkOrSdk: any
  /** 备案号 */
  recordNum: string | null | undefined
  /** 回调地址 */
  callBackUrl: string | null | undefined
}
/** 表格数据 */
const tableList = reactive<TableItem[]>([
  {
    appName: '应用名称1',
    appIntroduction: '应用简介1',
    companyHomePage: '主页1',
    appID: 'appID1',
    appSecret: 'appSecret1',
    recordNum: '备案号1',
    applicationStatus: '通过',
    apkOrSdk: 'apk',
    callBackUrl: '回调地址1'
  },
  //先造假数据
  {
    appName: '应用名称2',
    appIntroduction: '应用简介2',
    companyHomePage: '主页2',
    appID: 'appID2',
    appSecret: 'appSecret2',
    recordNum: '备案号2',
    applicationStatus: '拒绝',
    applicationReason: '就是不想给你通过 略略略'
  },
  {
    appName: '应用名称3',
    appIntroduction: '应用简介3',
    companyHomePage: '主页3',
    appID: 'appID3',
    appSecret: 'appSecret3',
    recordNum: '备案号3',
    applicationStatus: '拒绝',
    applicationReason: '就是不想给你通过3 略略略~~'
  },
  {
    appName: '应用名称3',
    appIntroduction: '应用简介3',
    companyHomePage: '主页3',
    appID: 'appID3',
    appSecret: 'appSecret3',
    recordNum: '备案号3',
    applicationStatus: '拒绝',
    applicationReason: '就是不想给你通过2 略略略~~'
  }
])
/** 搜索栏数据 */
const searchForm = reactive<SearchForm>({
  name: null,
  appID: null,
  recordNum: null,
  current: null,
  size: null,
  total: null
})
/** 上架信息 */
const putonInfo = reactive<PutonInfo>({
  appName: null,
  appIntroduction: null,
  companyHomePage: null,
  appID: null,
  appSecret: null,
  apkOrSdk: null,
  recordNum: null,
  callBackUrl: null
})
/** 上架对话框显隐 */
const putonDialog = ref<boolean>(false)
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
  putonDialog.value = false
}
//确认上架
const confirmPuton = (FormEl: FormInstance | undefined) => {
  if (FormEl) {
    FormEl.validate((valid) => {
      if (valid) {
        /** 调用接口 */
        console.log('submit!')

        putonDialog.value = false
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
//搜索事件
const handleSearch = () => {
  console.log(searchForm)
}
//清空搜索栏
const handleClear = () => {
  searchForm.name = null
  searchForm.appID = null
  searchForm.recordNum = null
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
/** 查看/编辑对话框显隐 */
const sonDialog = ref(false)
/**对话框是否可编辑 */
const isEdit = ref(false)
</script>
  
<style></style>