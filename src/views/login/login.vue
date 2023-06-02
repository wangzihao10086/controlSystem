<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">播控系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入手机号/邮箱" class="input-box">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password class="input-box" placeholder="请输入密码" v-model="param.password"
            @keyup.enter="submitForm(login)">
          </el-input>
        </el-form-item>
      </el-form>
      <el-button text class="btn-register" @click="register">注册账号</el-button>
      <div class="login-btn">
        <el-button type="primary" @click="submitForm(login)" :loading="loading">登录</el-button>
      </div>
      <el-button type="primary" @click="recordDialogVisible = true">备案查询</el-button>
    </div>
    <el-dialog v-model="recordDialogVisible" title="备案查询" width="50%" align-center @close="closeRecordDialog">
      <div class="flex flex-items-center">
        <el-input class="!w-[300px]" v-model="recordNum" placeholder="请输入备案号进行查询" clearable />
        <el-button type="primary" class="ml-[20px]" @click="handleRecordSearch">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import router from "@/router";
import type { FormInstance, FormRules } from "element-plus";
import { Message } from "@/components/common/Message";

import { useLogin, useUserInfo } from "@/hooks/api/common/index";
import LocalCache from "@/utils/cache";

const { loading, loginRequest } = useLogin();
const { userInfoRequest } = useUserInfo();

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
interface LoginInfo {
  username: string;
  password: string;
}

const param = reactive<LoginInfo>({
  username: "1231234",
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
  router.replace("/register");
};

// 点击登录按钮
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      loginRequest({
        loginId: param.username,
        pwd: param.password,
      }).then((res) => {
        storeUserInfo(res.data.token);
        Message.success("登录成功");
        userInfoRequest({ token: res.data.token }).then((res) => {
          res.data.userVo.role
            ? res.data.userVo.role == "ADMIN"
              ? router.push("/adminMain")
              : router.push("/userMain")
            : "";
        });
      });
    } else {
      Message.error("登录失败");
      return false;
    }
  });
};

// 保存用户数据
const storeUserInfo = (token: string) => {
  LocalCache.setCache("token", token);
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
