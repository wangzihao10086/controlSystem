<template>
  <div>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item :label="fieldList['rule_name']" prop="rule_name">
        <el-input
          v-model="searchInfo.rule_name"
          :placeholder="fieldList['rule_name']"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchInfo.status" placeholder="状态">
          <el-option label="生效中" :value="1" />
          <el-option label="未生效" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClear" icon="CircleClose"
          >清空</el-button
        >
        <el-button type="success" @click="onSearch" icon="Search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="control-box">
      <el-button
        type="primary"
        icon="CirclePlus"
        @click="addProjectControl('add')"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" size="large" stripe>
      <el-table-column fixed type="index" label="No." width="80" />
      <el-table-column prop="rule_name" :label="fieldList['rule_name']" />
      <el-table-column prop="projector" :label="fieldList['projector']" />
      <el-table-column prop="device_name" :label="fieldList['device_name']" />
      <el-table-column prop="user_name" :label="fieldList['user_name']" />
      <el-table-column prop="url" :label="fieldList['url']" />
      <el-table-column prop="fail_reason" :label="fieldList['fail_reason']" />
      <el-table-column fixed="right" label="操作" width="160">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            plain
            @click="addProjectControl('update', scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status === -1"
            type="success"
            size="small"
            @click="changeStatus(scope.row, scope.row.status)"
            plain
            >生效</el-button
          >
          <el-button
            v-else
            type="danger"
            size="small"
            plain
            @click="changeStatus(scope.row, scope.row.status)"
            >重置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AddProjectDialog
      v-model="dialogControl.isShow"
      :type="dialogControl.type"
      :data="dialogControl.data"
      :field-list="fieldList"
    ></AddProjectDialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

import AddProjectDialog from "@/components/admin/AddProjectDialog.vue";

const fieldList = {
  rule_name: "规则名称",
  projector: "限定投屏商",
  device_name: "设备",
  user_name: "用户",
  url: "内容",
  fail_reason: "原因",
};

// 搜索栏内容
const searchInfo = reactive({
  rule_name: "",
  status: "",
});

const dialogControl = reactive({
  isShow: false,
  type: "add",
  data: {},
});

const tableData = [
  {
    rule_name: "rule01",
    projector: "alibaba",
    device_name: "tv",
    user_name: "rose",
    url: "http://www.a.b.com",
    fail_reason: "不给播",
    status: -1,
  },
  {
    rule_name: "规则名称",
    projector: "titok",
    device_name: "tv",
    user_name: "toni",
    url: "https://www.baidu.com/",
    fail_reason: "",
    status: 1,
  },
];

// 修改规则状态
const changeStatus = (row: object, status: number) => {
  console.log(row, status);
  if (status == 0) {
    ElMessageBox.confirm(`确定将改规则${status ? "重置" : "生效"}？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        ElMessage({
          type: "success",
          message: "操作成功",
        });
      })
      .catch(() => {
        // ElMessage({
        //   type: "info",
        //   message: "取消操作",
        // });
      });
  } else {
    ElMessageBox.prompt("重置原因", "提示", {
      confirmButtonText: "提交",
      cancelButtonText: "取消",
      inputValidator: (val: string): boolean => {
        return val ? (val.trim() == "" ? false : true) : false;
      },
      inputErrorMessage: "请输入重置原因",
    })
      .then(({ value }) => {
        ElMessage({
          type: "success",
          message: `Your input is:${value}`,
        });
      })
      .catch(() => {
        // ElMessage({
        //   type: "info",
        //   message: "Input canceled",
        // });
      });
  }
};

// 创建规则
const addProjectControl = (type: string, data?: object) => {
  console.log(data);
  dialogControl.isShow = true;
  dialogControl.type = type;
  dialogControl.data = data ? { ...data } : {};
};

// 内容搜索
const onSearch = () => {
  console.log(searchInfo);
};

// 清空搜索
const searchClear = () => {
  searchInfo.rule_name = "";
  searchInfo.status = "";
};
</script>

<style lang="scss" scoped>
.control-box {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}
</style>
