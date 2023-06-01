<template>
  <div>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="URL" prop="url">
        <el-input v-model="searchInfo.url" placeholder="URL" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit" icon="Search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="control-box">
      <el-button type="primary" icon="CirclePlus" @click="addPolicy"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" size="large" stripe>
      <el-table-column fixed type="index" label="No." width="80" />
      <el-table-column prop="rule_name" :label="fieldList['rule_name']" />
      <el-table-column
        prop="rule_type"
        :formatter="getRuleType"
        :label="fieldList['rule_type']"
      />
      <el-table-column
        prop="matching_mode"
        :formatter="getRule"
        :label="fieldList['matching_mode']"
      />
      <el-table-column prop="rule" :label="fieldList['rule']" />
      <el-table-column
        prop="action"
        :formatter="getAction"
        :label="fieldList['action']"
      />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            size="small"
            plain
            @click="qualReviewRes(scope.row.status)"
            >生效</el-button
          >
          <el-button
            v-else
            type="danger"
            size="small"
            plain
            @click="qualReviewRes(scope.row.status)"
            >失效</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AddPolicyDialog
      v-model="dialogControl.isShow"
      :data="dialogControl.data"
      :fieldList="fieldList"
    >
    </AddPolicyDialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { ElForm, ElMessageBox, ElMessage } from "element-plus";

import AddPolicyDialog from "@/components/admin/AddPolicyDialog.vue";

interface dataType {
  rule_name: string;
  rule_type: string;
  matching_mode: string;
  rule: string;
  action: string;
  status: number | string;
}

const fieldList = {
  rule_name: "规则名称",
  rule_type: "规则类型",
  matching_mode: "匹配方式",
  rule: "规则",
  action: "指令",
  status: "",
};

const tableData = [
  {
    rule_name: "rule01",
    rule_type: "black",
    matching_mode: "prefix",
    rule: "www.lele",
    action: "forbidden",
    status: 0,
  },
  {
    rule_name: "rule02",
    rule_type: "white",
    matching_mode: "regex",
    rule: "/^/",
    action: "auditFree",
    status: 1,
  },
  {
    rule_name: "rule03",
    rule_type: "white",
    matching_mode: "suffix",
    rule: "bo.com",
    action: "auditFree",
    status: 1,
  },
  {
    rule_name: "rule04",
    rule_type: "white",
    matching_mode: "fully",
    rule: "https://www.ali.com",
    action: "auditRequired",
    status: 1,
  },
];

const searchInfo = reactive({
  url: "",
});

const dialogControl = reactive({
  isShow: false,
  data: {
    rule_name: "",
    rule_type: "white",
    rule: "prefix",
    url: "",
    action: "auditRequired",
  },
});

// 获取规则类型
const getRuleType = computed(() => {
  return (row: Object, column: Object, cellValue: string) => {
    return cellValue === "black" ? "黑名单" : "白名单";
  };
});

// 获取规则
const getRule = computed(() => {
  return (row: Object, column: Object, cellValue: string) => {
    const rule = {
      prefix: "前缀匹配",
      suffix: "后缀匹配",
      fully: "完全匹配",
      regex: "正则匹配",
    };
    return cellValue in rule ? rule[cellValue] : "";
  };
});

// 获取指令
const getAction = computed(() => {
  return (row: Object, column: Object, cellValue: string) => {
    const rule = {
      forbidden: "拦截",
      auditFree: "免审",
      auditRequired: "内容审核",
    };
    return cellValue in rule ? rule[cellValue] : "";
  };
});

const onSubmit = () => {
  console.log(searchInfo);
};

// 新增规则弹框
const addPolicy = () => {
  dialogControl.isShow = true;
};

// 修改规则状态
const qualReviewRes = (status: string) => {
  console.log(status);
  ElMessageBox.confirm(`确定将该规则${status ? "失效" : "生效"}？`, "提示", {
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
};
</script>

<style lang="scss" scoped>
.control-box {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}
</style>
