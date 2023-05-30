<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">播控系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input
            v-model="param.username"
            placeholder="请输入手机号/邮箱"
            class="input-box"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            show-password
            class="input-box"
            placeholder="请输入密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button text class="btn-register" @click="register"
        >注册账号</el-button
      >
      <div class="login-btn">
        <el-button type="primary" @click="submitForm(login)">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

interface LoginInfo {
  username: string;
  password: string;
}
const router = useRouter();
const param = reactive<LoginInfo>({
  username: "admin",
  password: "123123",
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
};
const login = ref<FormInstance>();

const register = () => {
  router.push("/register");
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success("登录成功");
      router.push("/");
    } else {
      ElMessage.error("登录失败");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.svg);
  background-size: 100%;
  .ms-login {
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
    .login-btn {
      text-align: center;
    }
    .login-btn button {
      width: 100%;
      height: 36px;
      margin-bottom: 10px;
      margin-top: 20px;
    }
  }
}
</style>
