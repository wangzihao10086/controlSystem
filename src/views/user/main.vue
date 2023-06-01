<template>
  <div>
    <!-- 用户账号信息展示 -->
    <div class="w-[100%] m-[auto] ">
      <div class="w-[100%]">
        <el-descriptions title="用户账号信息" :column="1" border size="large">
          <el-descriptions-item label="昵称" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ userInfo.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ userInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="email" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人姓名" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ userInfo.contactPerson }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ userInfo.IDNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="审核状态" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">
            <div v-if="companyInfo.applicationStatus === '待审核'">
              <el-tag type="warning" size="large">待认证</el-tag>&nbsp;
              <el-button type="primary" @click="authDialogVisible = true">去认证</el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 公司资质审核和展示 -->
      <div v-if="companyInfo.applicationStatus === '通过' || companyInfo.applicationStatus === '拒绝'"
        class="w-[100%] m-[auto] mt-[10px]">
        <el-descriptions title="公司资质审核" :column="1" border size="large">
          <el-descriptions-item label="公司名称" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ companyInfo.companyName }}
          </el-descriptions-item>
          <el-descriptions-item label="公司介绍" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ companyInfo.companyIntroduce }}
          </el-descriptions-item>
          <el-descriptions-item label="公司主页" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">{{ companyInfo.companyHomePage }}
          </el-descriptions-item>
          <el-descriptions-item label="审核状态" label-align="center" align="center" label-class-name="my-label"
            class-name="my-content" width="9.375rem">
            <el-tag v-if="companyInfo.applicationStatus === '通过'" type="success" size="large">审核通过</el-tag>
            <el-tag v-if="companyInfo.applicationStatus === '拒绝'" type="danger" size="large">审核不通过 原因{{
              companyInfo.applicationReason }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="companyInfo.applicationStatus === '通过'" label="营业执照" label-align="center"
            align="center" label-class-name="my-label" class-name="my-content" width="9.375rem">
            <el-image class="w-[18.125rem]" fit="scale-down" :src="companyInfo.companyLicense">
              <template #placeholder>
                <div>
                  营业执照加载中...
                </div>
              </template>
            </el-image>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- 认证的对话框 -->
    <el-dialog v-model="authDialogVisible" title="公司资质认证" width="50%" :before-close="authDialogClose">
      <el-form ref="ruleFormRef" :model="companyInfo" :rules="rules" label-width="7.5rem" class="demo-ruleForm"
        size="default" status-icon>
        <el-form-item label="公司全称" prop="companyName">
          <el-input v-model="companyInfo.companyName" />
        </el-form-item>
        <el-form-item label="公司介绍" prop="companyIntroduce">
          <el-input v-model="companyInfo.companyIntroduce" />
        </el-form-item>
        <el-form-item label="公司主页" prop="companyHomePage">
          <el-input v-model="companyInfo.companyHomePage" />
        </el-form-item>
        <el-form-item label="营业执照" prop="companyLicense">
          <el-upload list-type="picture" :before-upload="checkUpload" :show-file-list="false"
            :http-request="uploadCompanyLicense">
            <el-button size="large" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="authDialogClose">取消</el-button>
          <el-button type="primary" @click="confirmAuth(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules, UploadRequestHandler } from 'element-plus'
/** 账号信息接口 */
interface UserInfo {
  /** 昵称 */
  nickname: string
  /** 手机号 */
  phone: string
  /** email */
  email: string
  /** 联系人姓名 */
  contactPerson: string
  /** 身份证号 */
  IDNumber: string
}
/** 公司信息接口 */
interface CompanyInfo {
  /** 公司名称 */
  companyName: string
  /** 公司介绍 */
  companyIntroduce: string
  /** 公司主页 */
  companyHomePage: string
  /** 营业执照 */
  companyLicense?: string
  /** 审核状态 */
  applicationStatus: string
  /** 拒绝原因 */
  applicationReason?: string
}
/** 账号信息 */
const userInfo = reactive<UserInfo>({
  nickname: 'nickname',
  phone: '13088598741',
  email: '1472588369@gmail.com',
  contactPerson: '我是联系人姓名',
  IDNumber: '4504****3698',
})
/** 公司信息 */
const companyInfo = reactive<CompanyInfo>({
  companyName: '',
  companyIntroduce: '',
  companyHomePage: '',
  companyLicense: '',
  applicationStatus: '待审核',
  applicationReason: '',
  // companyName: 'companyName',
  // companyIntroduce: 'companyIntroduce',
  // companyHomePage: 'companyHomePage',
  // companyLicense: 'https://picsum.photos/400',
  // applicationStatus: '待审核',
  // applicationReason: '就不给你过',
})
/** 认证对话框的显隐 */
const authDialogVisible = ref<boolean>(false)
/** 表单实例 */
const ruleFormRef = ref<FormInstance>()
//关闭认证对话框
const authDialogClose = () => {
  //提示用户
  ElMessage({
    message: '取消认证',
    type: 'info',
  })
  ruleFormRef.value?.resetFields()
  authDialogVisible.value = false

}
//确认认证
const confirmAuth = (FormEl: FormInstance | undefined) => {
  if (FormEl) {
    FormEl.validate((valid) => {
      if (valid) {
        /** 调用接口 */
        console.log('submit!')

        authDialogVisible.value = false
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
//表单验证规则
const rules = reactive<FormRules>({
  companyName: [
    { required: true, message: '请输入公司全称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  companyIntroduce: [
    { required: true, message: '请输入公司介绍', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  companyHomePage: [
    { required: true, message: '请输入公司主页', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  companyLicense: [
    { required: true, message: '请上传营业执照', trigger: 'blur' }
  ],
})

/** 上传营业执照之前校验 */
const checkUpload = (file: File) => {
  // 判断类型
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    ElMessage({
      message: '只能上传jpg/png文件',
      type: 'error',
    })
    return false
  }
  // 判断大小
  if (file.size > 5 * 1024 * 1024) {
    ElMessage({
      message: '图片大小不能超过5MB',
      type: 'error',
    })
    return false
  }
  companyInfo.companyLicense = 'w'
  //触发表单营业执照规则的验证
  ruleFormRef.value?.validateField('companyLicense')
}
/** 上传营业执照的方法 */
const uploadCompanyLicense: UploadRequestHandler = (params: any): any => {

  try {
    companyInfo.companyLicense = 'w'

    console.log(params);
  } catch (error) {

  }

}
</script>

<style scoped lang="scss"></style>
