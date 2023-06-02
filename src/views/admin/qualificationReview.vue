<template>
  <div>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="公司名称" prop="company_name">
        <el-input v-model="searchInfo.company_name" placeholder="公司名称" />
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
    <el-table :data="tableData" style="width: 100%" size="large" stripe>
      <el-table-column fixed type="index" label="No." width="80" />
      <el-table-column prop="company_name" :label="fieldList['company_name']" />
      <el-table-column prop="name" :label="fieldList['name']" />
      <el-table-column prop="id_card_no" :label="fieldList['id_card_no']">
        <template #default="scope">
          <span>
            {{ hideIdCard(scope.row.id_card_no) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" :label="fieldList['phone']" />
      <el-table-column prop="create_time" :label="fieldList['create_time']" />
      <el-table-column prop="update_time" :label="fieldList['update_time']" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            size="small"
            @click="handleClick(scope.row, 'review')"
            plain
            >审核</el-button
          >
          <el-button
            v-else
            type="primary"
            size="small"
            plain
            @click="handleClick(scope.row, 'view')"
            >查看</el-button
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
          <el-button type="danger" @click="qualReviewRes(-1)">
            不通过
          </el-button>
          <el-button type="success" @click="qualReviewRes(1)"> 通过 </el-button>
        </span>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
interface dataType {
  create_time: string;
  update_time: string;
  user_id: string;
  company_name: string;
  company_desc: string;
  homepage: string;
  licence_url: string;
  id_card_no: string;
  name: string;
  phone: string;
  status: number | string;
}

interface dialogControlType {
  type: string;
  isShow: boolean;
  data: dataType;
}

import { reactive } from "vue";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";
import { Message } from "@/components/common/Message";

import { hideIdCard } from "@/assets/ts/functions.ts";

import Dialog from "@/components/admin/Dialog.vue";

const fieldList = {
  create_time: "创建时间",
  update_time: "修改时间",
  company_name: "公司名称",
  company_desc: "公司描述",
  id_card_no: "身份证号",
  name: "提交人",
  phone: "手机号",
  status: "审核状态",
};

const dialogControl = reactive<dialogControlType>({
  type: "view",
  isShow: false,
  data: {
    create_time: "",
    update_time: "",
    user_id: "",
    company_name: "",
    company_desc: "",
    homepage: "",
    licence_url: "",
    id_card_no: "",
    name: "",
    phone: "",
    status: 0,
  },
});

const searchInfo = reactive({
  company_name: "",
  status: "",
});

const tableData = [
  {
    create_time: "2016-05-03",
    update_time: "2023-06-01",
    user_id: "1631561",
    company_name: "乐播",
    company_desc: "无线投屏",
    homepage: "",
    licence_url: "Home",
    id_card_no: "441622200101011001",
    name: "lebo",
    phone: "1008611",
    status: 0,
  },
  {
    create_time: "2016-05-03",
    update_time: "2023-06-01",
    user_id: "1631561",
    company_name: "乐播",
    company_desc: "无线投屏",
    homepage: "",
    licence_url: "Home",
    id_card_no: "441622200101011001",
    name: "lebo",
    phone: "1008611",
    status: 1,
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
const handleClick = (info: dataType, type: string) => {
  dialogControl.isShow = true;
  dialogControl.data = { ...info };
  dialogControl.type = type;
  dialogControl.data.status = getStatus(dialogControl.data.status);
};

// 计算当前 status 对应的状态
const getStatus = (status: number | string) => {
  return status === 0 ? "审核中" : status === 1 ? "通过" : "不通过";
};

// 保存审核结果
const qualReviewRes = (result: number) => {
  if (result == 1) {
    ElMessageBox.confirm(`确定通过审核？`, "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        Message.success({
          message: "操作成功",
        });
        dialogControl.isShow = false;
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消操作",
        });
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
};
</script>

<style lang="scss" scoped></style>
