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
        <el-form-item prop="nickname" label="昵称">
          <el-input
            v-model="param.nickname"
            placeholder="请输入昵称"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input
            v-model="param.phone"
            placeholder="请输入手机号"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="param.email" placeholder="请输入邮箱" size="large">
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="密码">
          <el-input
            type="password"
            show-password
            placeholder="请输入密码"
            size="large"
            v-model="param.pwd"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="pwdSub" label="确认密码">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            size="large"
            v-model="param.pwdSub"
            @keyup.enter="submitForm(register)"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="register-btn">
        <el-button
          type="primary"
          @click="submitForm(register)"
          :loading="loading"
        >
          注册
        </el-button>
      </div>
      <el-button type="primary" @click="recordDialogVisible = true"
        >备案查询</el-button
      >
    </div>
    <el-dialog
      v-model="recordDialogVisible"
      title="备案查询"
      width="50%"
      align-center
      @close="closeRecordDialog"
    >
      <div class="flex flex-items-center">
        <el-input
          class="!w-[300px]"
          v-model="recordNum"
          placeholder="请输入备案号进行查询"
          clearable
        />
        <el-button type="primary" class="ml-[20px]" @click="handleRecordSearch"
          >查询</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { Message } from "@/components/common/Message";

import { useRegister } from "@/hooks/api/common";

const { loading, registerRequest } = useRegister();

/** 备案号 */
const recordNum = ref("");
/** 备案查询对话框显隐 */
const recordDialogVisible = ref(false);
//关闭备案查询对话框
const closeRecordDialog = () => {
  recordDialogVisible.value = false;
  recordNum.value = "";
};
//点击备案查询按钮事件
const handleRecordSearch = () => {
  console.log(recordNum.value);
};
interface registerInfo {
  nickname: string;
  phone: string;
  email: string;
  pwd: string;
  pwdSub: string;
}
const router = useRouter();
const param = reactive<registerInfo>({
  nickname: "",
  email: "",
  phone: "",
  pwd: "",
  pwdSub: "",
});
const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      pattern:
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,10}$/,
      message: "请正确输入邮箱",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      pattern: /^1[3456789]\d{9}$/,
      message: "请正确输入手机号",
      trigger: "blur",
    },
  ],
  pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  pwdSub: [{ required: true, message: "请再次输入密码", trigger: "blur" }],
};
const register = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      if (param.pwd !== param.pwdSub) {
        Message.error("两次输入密码不一致");
      } else {
        registerRequest({ ...param }).then((res) => {
          Message.success("注册成功");
          router.push("/login");
        });
      }
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
