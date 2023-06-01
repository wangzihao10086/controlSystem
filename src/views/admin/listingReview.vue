<template>
  <div>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item :label="fieldList['app_name']" prop="app_name">
        <el-input
          v-model="searchInfo.app_name"
          :placeholder="fieldList['app_name']"
        />
      </el-form-item>
      <el-form-item :label="fieldList['company_name']" prop="company_name">
        <el-input
          v-model="searchInfo.company_name"
          :placeholder="fieldList['company_name']"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchInfo.status" placeholder="状态">
          <el-option label="审核" :value="0" />
          <el-option label="通过" :value="1" />
          <el-option label="不通过" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClear" icon="CircleClose"
          >清空</el-button
        >
        <el-button type="success" @click="onSubmit" icon="Search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column fixed type="index" label="No." width="50" />
      <el-table-column prop="app_name" :label="fieldList['app_name']" />
      <el-table-column prop="app_desc" :label="fieldList['app_desc']" />
      <el-table-column prop="homepage" :label="fieldList['homepage']" />
      <el-table-column prop="app_id" :label="fieldList['app_id']" />
      <el-table-column prop="download_url" :label="fieldList['download_url']" />
      <el-table-column prop="url" :label="fieldList['url']" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="primary"
            size="small"
            @click="handleClick(scope.row, 'review')"
            plain
            >审核</el-button
          >
          <el-button
            v-else
            :type="scope.row.status === 1 ? 'success' : 'danger'"
            size="small"
            plain
            disabled
            >{{ scope.row.status === 1 ? "审核通过" : "审核不通过" }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Dialog
      :type="dialogControl.type"
      v-model="dialogControl.isShow"
      :data="dialogControl.data"
      :fieldList="fieldList"
    >
      <template #footer>
        <span v-if="dialogControl.type == 'review'" class="dialog-footer">
          <el-button type="danger" @click="qualReviewRes(0)">
            不通过
          </el-button>
          <el-button type="success" @click="qualReviewRes(1)"> 通过 </el-button>
        </span>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";

import Dialog from "@/components/admin/Dialog.vue";

const fieldList = {
  app_name: "App名称",
  app_desc: "简介",
  homepage: "主页",
  app_id: "appId",
  appSecret: "app秘钥",
  download_url: "应用",
  url: "demo地址",
  status: "审核状态",
  company_name: "公司名称",
};

const dialogControl = reactive({
  type: "view",
  isShow: false,
  data: {},
});

const searchInfo = reactive({
  app_name: "",
  company_name: "",
  status: "",
});

const tableData = [
  {
    app_name: "titok",
    app_desc: "抖音",
    homepage: "https://www.titok.cn",
    app_id: "h5d25g5c2df",
    appSecret: "隐藏",
    download_url: "https://www.titok.download.cn",
    url: "https://www.titok.cn",
    status: 0,
  },
  {
    app_name: "titok",
    app_desc: "抖音",
    homepage: "https://www.titok.cn",
    app_id: "h5d25g5c2df",
    appSecret: "隐藏",
    download_url: "https://www.titok.download.cn",
    url: "https://www.titok.cn",
    status: 1,
  },
  {
    app_name: "titok",
    app_desc: "抖音",
    homepage: "https://www.titok.cn",
    app_id: "h5d25g5c2df",
    appSecret: "隐藏",
    download_url: "https://www.titok.download.cn",
    url: "https://www.titok.cn",
    status: -1,
  },
];

const onSubmit = () => {
  console.log(searchInfo);
};
// 清空搜索框
const searchClear = () => {
  searchInfo.company_name = "";
  searchInfo.status = "";
};

// 控制 dialog 的弹出
const handleClick = (info: object, type: string) => {
  dialogControl.isShow = true;
  dialogControl.data = { ...info };
  dialogControl.type = type;
  dialogControl.data.status = getStatus(dialogControl.data.status);
};

// 计算当前 status 对应的状态
const getStatus = (status: number) => {
  return status === 0 ? "审核中" : status === 1 ? "通过" : "不通过";
};

// 保存审核结果
const qualReviewRes = (result: number) => {
  console.log(result);
  if (result == 1) {
    ElMessageBox.confirm(`确定通过审核？`, "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        ElMessage({
          type: "success",
          message: "操作成功",
        });
        dialogControl.isShow = false;
      })
      .catch(() => {
        // ElMessage({
        //   type: "info",
        //   message: "取消操作",
        // });
      });
  } else {
    ElMessageBox.prompt("不通过原因", "提示", {
      confirmButtonText: "提交",
      cancelButtonText: "取消",
      inputValidator: (val: string): boolean => {
        return val ? (val.trim() == "" ? false : true) : false;
      },
      inputErrorMessage: "请输入不通过原因",
    })
      .then(({ value }) => {
        ElMessage({
          type: "success",
          message: `不通过原因: ${value}`,
        });
        dialogControl.isShow = false;
      })
      .catch(() => {
        // ElMessage({
        //   type: "info",
        //   message: "Input canceled",
        // });
      });
  }
  // ElMessageBox.confirm(`确定${result ? "" : "不"}通过审核？`, "Warning", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning",
  // })
  //   .then(() => {
  //     ElMessage({
  //       type: "success",
  //       message: "操作成功",
  //     });
  //   })
  //   .catch(() => {
  //     ElMessage({
  //       type: "info",
  //       message: "取消操作",
  //     });
  //   })
  //   .finally(() => {
  //     dialogControl.isShow = false;
  //   });
};
</script>

<style lang="scss" scoped></style>
