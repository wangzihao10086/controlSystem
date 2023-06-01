<template>
  <div class="login-wrap">
    <div class="ms-register">
      <div class="ms-title">注册中心</div>
      <el-form
        :model="param"
        :rules="rules"
        label-width="85px"
        label-position="left"
        ref="register"
        class="ms-content"
      >
        <el-form-item prop="username" label="账号">
          <el-input
            v-model="param.username"
            placeholder="请输入手机号/邮箱"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            show-password
            placeholder="请输入密码"
            size="large"
            v-model="param.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="passwordSub" label="确认密码">
          <el-input
            type="password"
            show-password
            placeholder="请再次输入密码"
            size="large"
            v-model="param.password"
            @keyup.enter="submitForm(register)"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="register-btn">
        <el-button type="primary" @click="submitForm(register)">
          注册
        </el-button>
      </div>
      <el-button type="primary" @click="recordDialogVisible = true" >备案查询</el-button>
    </div>
     <el-dialog
        v-model="recordDialogVisible"
        title="备案查询"
        width="50%"
        align-center
        @close="closeRecordDialog"
      >
       <div class="flex flex-items-center">
            <el-input class="!w-[300px]"  v-model="recordNum" placeholder="请输入备案号进行查询" clearable  />
            <el-button type="primary" class="ml-[20px]" @click="handleRecordSearch">查询</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
/** 备案号 */
const recordNum = ref('')
/** 备案查询对话框显隐 */
const recordDialogVisible = ref(false)
//关闭备案查询对话框
const closeRecordDialog = () => {
  recordDialogVisible.value = false
  recordNum.value = ''
}
//点击备案查询按钮事件
const handleRecordSearch = () => {
  console.log(recordNum.value)
}
interface registerInfo {
  username: string;
  password: string;
  passwordSub: string;
}
const router = useRouter();
const param = reactive<registerInfo>({
  username: "",
  password: "",
  passwordSub: "",
});
const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  passwordSub: [{ required: true, message: "请再次输入密码", trigger: "blur" }],
};
const register = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success("注册成功");
      router.push("/");
    } else {
      ElMessage.error("注册失败");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url(../../assets/img/login-bg.svg);
  background-size: 100%;
  .ms-register {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 570px;
    /* margin: -190px 0 0 -175px; */
    transform: translate(-50%, -60%);
    border-radius: 5px;
    background: #f8f8f8;
    overflow: hidden;
    padding: 0px 30px 30px;
    .ms-title {
      width: 100%;
      line-height: 120px;
      text-align: center;
      font-size: 40px;
      color: #1f1f1f;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      letter-spacing: 3px;
    }
    .ms-content {
      padding-top: 30px;
      ::v-deep(.el-form-item) {
        display: flex;
        align-items: center;
      }
      .input-box {
        height: 45px;
      }
      .btn-register {
        float: right;
        color: rgb(18, 133, 255);
        font-weight: bold;
      }
    }
    .btn-register {
      float: right;
      color: rgb(18, 133, 255);
      font-weight: bold;
    }
    .register-btn {
      text-align: center;
    }
    .register-btn button {
      width: 100%;
      height: 36px;
      margin-bottom: 10px;
      margin-top: 20px;
    }
  }
}
</style>
